import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { getInnovationQuickChallenge, innovationQuestions, isInnovationField, isInnovationLevel } from '@/lib/innovation';
import { scoreInnovationAnswer } from '@/lib/innovation-scoring';
import { requireSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const field = request.nextUrl.searchParams.get('field') ?? 'Business';
    if (!isInnovationField(field)) return NextResponse.json({ success: false, message: 'Invalid field.' }, { status: 400 });
    const requestedLimit = Number(request.nextUrl.searchParams.get('limit') ?? 3);
    const limit = Number.isFinite(requestedLimit) ? Math.min(100, Math.max(3, Math.floor(requestedLimit))) : 3;

    const viewerId = getUserId(request);
    const { data, error } = await requireSupabase()
      .from('innovation_answers')
      .select('id, user_id, username, field, level, question, answer, votes, ai_score, ai_feedback, created_at')
      .eq('field', field)
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) throw error;

    const standings = new Map<string, {
      userId: string; username: string; points: number; votes: number; answerCount: number;
      answerId: string; answer: string; level: string; aiFeedback: string | null; answerScore: number; createdAt: string;
    }>();

    for (const item of data ?? []) {
      const points = Number(item.ai_score ?? 0);
      const current = standings.get(item.user_id);
      const isBetterAnswer = !current || points > current.answerScore || (points === current.answerScore && Number(item.votes ?? 0) > current.votes);
      standings.set(item.user_id, {
        userId: item.user_id,
        username: item.username,
        points: (current?.points ?? 0) + points,
        votes: (current?.votes ?? 0) + Number(item.votes ?? 0),
        answerCount: (current?.answerCount ?? 0) + 1,
        answerId: isBetterAnswer ? item.id : current!.answerId,
        answer: isBetterAnswer ? item.answer : current!.answer,
        level: isBetterAnswer ? item.level : current!.level,
        aiFeedback: isBetterAnswer ? item.ai_feedback : current!.aiFeedback,
        answerScore: isBetterAnswer ? points : current!.answerScore,
        createdAt: isBetterAnswer ? item.created_at : current!.createdAt,
      });
    }

    const ranked = [...standings.values()]
      .sort((a, b) => b.points - a.points || b.votes - a.votes || a.createdAt.localeCompare(b.createdAt))
      .map((item, index) => ({ ...item, rank: index + 1 }));
    const viewer = viewerId ? ranked.find((item) => item.userId === viewerId) ?? null : null;

    return NextResponse.json({ success: true, data: ranked.slice(0, limit), totalContributors: ranked.length, viewer: viewer ? { rank: viewer.rank, points: viewer.points, answerCount: viewer.answerCount } : null });
  } catch (error) {
    console.error('Innovation leaderboard fetch error:', error);
    return NextResponse.json({ success: false, message: 'Unable to load the leaderboard.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) return NextResponse.json({ success: false, message: 'Please sign in to contribute or vote.' }, { status: 401 });

    const body = await request.json();
    const db = requireSupabase();

    if (body.action === 'answer') {
      const { field, level } = body;
      const answer = typeof body.answer === 'string' ? body.answer.trim() : '';
      if (!isInnovationField(field) || !isInnovationLevel(level)) return NextResponse.json({ success: false, message: 'Choose a valid field and level.' }, { status: 400 });
      if (answer.length < 30 || answer.length > 1500) return NextResponse.json({ success: false, message: 'Answers must be between 30 and 1,500 characters.' }, { status: 400 });

      const { data: user, error: userError } = await db.from('users').select('name').eq('id', userId).maybeSingle();
      if (userError || !user) return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });

      const score = await scoreInnovationAnswer({ field, level, question: innovationQuestions[field][level], answer });

      const { data, error } = await db.from('innovation_answers').insert([{
        user_id: userId,
        username: user.name,
        field,
        level,
        question: innovationQuestions[field][level],
        answer,
        votes: 0,
        ai_score: score.points,
        ai_feedback: score.feedback,
      }]).select().single();
      if (error) throw error;
      return NextResponse.json({ success: true, message: `Your answer earned ${score.points}/10 automatic rubric points and is now on the innovation board.`, data }, { status: 201 });
    }

    if (body.action === 'quick-answer') {
      const { field, level } = body;
      const round = Number(body.round);
      const selectedOptionId = typeof body.selectedOptionId === 'string' ? body.selectedOptionId : '';
      if (!isInnovationField(field) || !isInnovationLevel(level)) return NextResponse.json({ success: false, message: 'Choose a valid field and level.' }, { status: 400 });
      if (!Number.isInteger(round) || round < 1 || round > 1_000_000) return NextResponse.json({ success: false, message: 'Choose a valid challenge round.' }, { status: 400 });

      const challenge = getInnovationQuickChallenge(field, level, round);
      const selectedOption = challenge.options.find((option) => option.id === selectedOptionId);
      if (!selectedOption) return NextResponse.json({ success: false, message: 'Choose one answer before submitting.' }, { status: 400 });

      const { data: previousAttempt, error: attemptError } = await db
        .from('innovation_answers')
        .select('id')
        .eq('user_id', userId)
        .eq('field', field)
        .eq('question', challenge.question)
        .maybeSingle();
      if (attemptError) throw attemptError;
      if (previousAttempt) return NextResponse.json({ success: false, message: 'You have already completed this quick challenge. Choose a new challenge to keep going.' }, { status: 409 });

      const { data: user, error: userError } = await db.from('users').select('name').eq('id', userId).maybeSingle();
      if (userError || !user) return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });

      const correct = selectedOption.id === challenge.correctOptionId;
      const points = correct ? challenge.points : 0;
      const { data, error } = await db.from('innovation_answers').insert([{
        user_id: userId,
        username: user.name,
        field,
        level,
        question: challenge.question,
        answer: `Quick challenge selection: ${selectedOption.text}`,
        votes: 0,
        ai_score: points,
        ai_feedback: correct
          ? `Quick challenge correct: ${challenge.points} points awarded for selecting the strongest practical first step.`
          : 'Quick challenge completed: this option was not the strongest practical first step. Try a new round to keep learning.',
      }]).select().single();
      if (error) throw error;

      return NextResponse.json({ success: true, message: correct ? `Correct—${challenge.points} points added to your rank.` : 'Challenge completed. The best answer focuses on understanding the situation, involving affected people, and testing a practical step.', data }, { status: 201 });
    }

    if (body.action === 'vote') {
      const answerId = typeof body.answerId === 'string' ? body.answerId : '';
      if (!answerId) return NextResponse.json({ success: false, message: 'Choose an answer to vote for.' }, { status: 400 });

      const { data: answer, error: answerError } = await db.from('innovation_answers').select('id, user_id, field').eq('id', answerId).maybeSingle();
      if (answerError || !answer) return NextResponse.json({ success: false, message: 'Answer not found.' }, { status: 404 });
      if (answer.user_id === userId) return NextResponse.json({ success: false, message: 'You cannot vote for your own answer.' }, { status: 403 });

      const { error: voteError } = await db.from('innovation_votes').insert([{ answer_id: answerId, user_id: userId }]);
      if (voteError?.code === '23505') return NextResponse.json({ success: false, message: 'You have already voted for this answer.' }, { status: 409 });
      if (voteError) throw voteError;

      const { count, error: countError } = await db.from('innovation_votes').select('id', { count: 'exact', head: true }).eq('answer_id', answerId);
      if (countError) throw countError;
      const { data, error: updateError } = await db.from('innovation_answers').update({ votes: count ?? 0 }).eq('id', answerId).select().single();
      if (updateError) throw updateError;

      return NextResponse.json({ success: true, message: 'Your vote has been counted.', data });
    }

    if (body.action === 'rescore') {
      const { field } = body;
      if (!isInnovationField(field)) return NextResponse.json({ success: false, message: 'Choose a valid field.' }, { status: 400 });

      const { data: existingAnswers, error: existingError } = await db
        .from('innovation_answers')
        .select('id, field, level, question, answer')
        .eq('user_id', userId)
        .eq('field', field)
        .eq('ai_score', 0)
        .is('ai_feedback', null);
      if (existingError) throw existingError;
      if (!existingAnswers?.length) return NextResponse.json({ success: false, message: 'You have no unscored answers in this field.' }, { status: 400 });

      let totalPoints = 0;
      for (const item of existingAnswers) {
        if (!isInnovationField(item.field) || !isInnovationLevel(item.level)) continue;
        const score = await scoreInnovationAnswer({ field: item.field, level: item.level, question: item.question, answer: item.answer });
        const { error: updateError } = await db.from('innovation_answers').update({ ai_score: score.points, ai_feedback: score.feedback }).eq('id', item.id);
        if (updateError) throw updateError;
        totalPoints += score.points;
      }

      return NextResponse.json({ success: true, message: `${existingAnswers.length} existing answer${existingAnswers.length === 1 ? '' : 's'} scored for ${totalPoints} points.`, data: { totalPoints } });
    }

    return NextResponse.json({ success: false, message: 'Invalid innovation action.' }, { status: 400 });
  } catch (error) {
    console.error('Innovation action error:', error);
    return NextResponse.json({ success: false, message: 'Unable to complete that action.' }, { status: 500 });
  }
}

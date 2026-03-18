# Pinkora Authentication - Feature Implementation Guide

## ⚠️ IMPORTANT: Architecture Note
This guide was originally written for Firebase/Firestore. The Pinkora system has been **migrated to PHP + MySQL**.

**Key Changes:**
- Replace `db.collection().add()` with `fetch()` calls to PHP API endpoints
- Replace `currentUser.uid` with `currentUser.id` (from PHP sessions)
- Database operations are now handled by PHP backend instead of Firestore
- All data is stored in MySQL database, not Firestore
- See `api/` folder for PHP endpoint implementations

**Current Stack:**
- Frontend: HTML, CSS, JavaScript (auth.js)
- Backend: PHP APIs in `api/` folder
- Database: MySQL with schema from `database-setup.sql`

---

## Overview
This guide explains how to implement the additional features that are already set up in your dashboard:
- Payments & Purchases
- Subscriptions
- Comments & Reviews
- User Access Control

---

## Feature 1: Payment Integration (Stripe or PayPal)

### Option A: Stripe Payments

#### 1. Setup Stripe Account
1. Go to: https://stripe.com
2. Create account and verify email
3. Get **Publishable Key** and **Secret Key** from Dashboard
4. Add Stripe keys to auth.js

#### 2. Add to auth.js
```javascript
// Add Stripe configuration
const STRIPE_PUBLIC_KEY = "pk_live_your_publishable_key_here";

// Function to handle payments
async function processPayment(projectId, amount, currency = 'USD') {
  if (!currentUser) {
    alert('Please sign in to purchase');
    return;
  }

  // Save purchase to Firestore
  const purchaseRef = await db.collection('purchases').add({
    userId: currentUser.uid,
    userEmail: currentUser.email,
    projectId: projectId,
    amount: amount,
    currency: currency,
    status: 'pending',
    timestamp: new Date()
  });

  // Redirect to payment form
  // You would implement Stripe Checkout or Payment Intent here
}
```

#### 3. Add Payment Form to account.html
```html
<div id="paymentModal" class="modal" style="display:none;">
  <div class="modal-content">
    <button class="modal-close" onclick="closePaymentModal()">&times;</button>
    <h2>Complete Your Purchase</h2>
    
    <form id="paymentForm" class="auth-form">
      <div id="card-element"></div>
      <div id="card-errors" style="color:#ef4444;margin-top:10px;"></div>
      <button type="submit" class="btn btn-primary">Pay Now</button>
    </form>
  </div>
</div>
```

#### 4. Handle Payment in auth.js
```javascript
// Load Stripe
const stripe = Stripe(STRIPE_PUBLIC_KEY);
const elements = stripe.elements();
const cardElement = elements.create('card');

document.addEventListener('DOMContentLoaded', () => {
  const cardElement = document.getElementById('card-element');
  if (cardElement) {
    cardElement.mount('#card-element');
  }

  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const {paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      });

      // Send payment to your backend server
      // Your backend should handle Stripe Payment Intent
    });
  }
});
```

---

## Feature 2: Subscription System

### Setup Recurring Billing

#### 1. Add Subscription Plans to Firestore
```javascript
// Initialize subscription plans (one-time setup)
async function initSubscriptionPlans() {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      interval: 'month',
      description: 'Basic access to projects',
      features: ['5 Projects', 'Email Support']
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 29.99,
      interval: 'month',
      description: 'Professional features',
      features: ['Unlimited Projects', 'Priority Support', 'Advanced Analytics']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      interval: 'month',
      description: 'Full enterprise suite',
      features: ['Everything in Pro', 'Dedicated Support', 'Custom Integration']
    }
  ];

  for (const plan of plans) {
    await db.collection('subscriptionPlans').doc(plan.id).set(plan);
  }
}
```

#### 2. Create Subscription Handler
```javascript
async function createSubscription(planId) {
  if (!currentUser) {
    alert('Please sign in first');
    return;
  }

  try {
    // Create subscription in Firestore
    await db.collection('subscriptions').add({
      userId: currentUser.uid,
      userEmail: currentUser.email,
      planId: planId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30*24*60*60*1000), // 30 days
      status: 'active',
      autoRenew: true,
      lastBillingDate: new Date()
    });

    // Update user document
    await db.collection('users').doc(currentUser.uid).update({
      subscriptionPlan: planId,
      subscriptionStatus: 'active'
    });

    alert('Subscription activated!');
    showSubscriptions();
  } catch (error) {
    console.error('Subscription error:', error);
    alert('Failed to create subscription');
  }
}

async function cancelSubscription() {
  if (!currentUser) return;

  try {
    const subscriptions = await db.collection('subscriptions')
      .where('userId', '==', currentUser.uid)
      .where('status', '==', 'active')
      .get();

    for (const doc of subscriptions.docs) {
      await doc.ref.update({
        status: 'cancelled',
        cancelledAt: new Date()
      });
    }

    alert('Subscription cancelled');
  } catch (error) {
    console.error('Cancellation error:', error);
  }
}
```

#### 3. Display Subscription Plans
```html
<!-- Add to account.html -->
<div id="subscriptionModal" class="modal" style="display:none;">
  <div class="modal-content">
    <button class="modal-close" onclick="closeSubscriptionModal()">&times;</button>
    <h2>Choose Your Plan</h2>
    
    <div id="plansContainer" style="display:grid;gap:20px;margin-top:20px;">
      <!-- Plans loaded dynamically -->
    </div>
  </div>
</div>
```

---

## Feature 3: Comments & Reviews System

### Setup Comments Collection

#### 1. Add Comment Handler
```javascript
async function submitComment(projectId, commentText, rating = 5) {
  if (!currentUser) {
    alert('Please sign in to comment');
    return;
  }

  try {
    await db.collection('comments').add({
      projectId: projectId,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userEmail: currentUser.email,
      userPhoto: currentUser.photoURL,
      comment: commentText,
      rating: rating,
      timestamp: new Date(),
      likes: 0,
      approved: false // Requires moderation
    });

    alert('Thank you for your comment!');
    loadComments(projectId);
  } catch (error) {
    console.error('Comment error:', error);
    alert('Failed to submit comment');
  }
}

async function loadComments(projectId) {
  const commentsRef = db.collection('comments')
    .where('projectId', '==', projectId)
    .where('approved', '==', true)
    .orderBy('timestamp', 'desc');

  const snapshot = await commentsRef.get();
  const comments = [];

  snapshot.forEach(doc => {
    comments.push({
      id: doc.id,
      ...doc.data()
    });
  });

  displayComments(comments);
}

function displayComments(comments) {
  const container = document.getElementById('commentsContainer');
  if (!container) return;

  container.innerHTML = comments.map(comment => `
    <div class="comment-card">
      <div class="comment-header">
        <img src="${comment.userPhoto}" alt="${comment.userName}" class="comment-avatar">
        <div>
          <strong>${comment.userName}</strong>
          <p class="comment-date">${new Date(comment.timestamp.toDate()).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="comment-rating">
        ${'⭐'.repeat(comment.rating)}
      </div>
      <p class="comment-text">${comment.comment}</p>
    </div>
  `).join('');
}
```

#### 2. Add Comment UI to projects
```html
<!-- Add to each project page -->
<section id="commentsSection" class="comments-section" style="margin-top:40px;">
  <h3>Comments & Reviews</h3>
  
  <div id="commentForm" class="comment-form">
    <textarea id="commentText" placeholder="Share your thoughts..." rows="4"></textarea>
    <div class="rating-selector">
      ⭐ ⭐ ⭐ ⭐ ⭐
    </div>
    <button class="btn btn-primary" onclick="submitComment(projectId, document.getElementById('commentText').value)">
      Post Comment
    </button>
  </div>

  <div id="commentsContainer" class="comments-list">
    <!-- Comments loaded here -->
  </div>
</section>
```

---

## Feature 4: User Access Control

### Setup Content Gating

#### 1. Check Subscription Status
```javascript
async function canAccessProject(projectId) {
  if (!currentUser) return false;

  // Check if user has active subscription
  const subscriptions = await db.collection('subscriptions')
    .where('userId', '==', currentUser.uid)
    .where('status', '==', 'active')
    .get();

  if (!subscriptions.empty) return true;

  // Check if user purchased this project
  const purchase = await db.collection('purchases')
    .where('userId', '==', currentUser.uid)
    .where('projectId', '==', projectId)
    .where('status', '==', 'completed')
    .get();

  return !purchase.empty;
}

async function accessProject(projectId) {
  const hasAccess = await canAccessProject(projectId);

  if (!hasAccess) {
    alert('Please purchase or subscribe to access this project');
    showSubscriptions();
    return;
  }

  // Load project content
  window.location.href = `/project/${projectId}`;
}
```

#### 2. Protect Project Content
```javascript
// In projects.html project click handler
card.addEventListener('click', async (e) => {
  if (e.target !== a && !a.contains(e.target)) {
    const hasAccess = await canAccessProject(projectId);
    if (hasAccess) {
      window.location.href = p.link;
    } else {
      alert('This project requires a subscription or purchase');
    }
  }
});
```

---

## Database Schema

### Users Collection
```javascript
{
  uid: "user123",
  name: "John Doe",
  email: "john@example.com",
  photoURL: "https://...",
  createdAt: Timestamp,
  lastLogin: Timestamp,
  subscriptionPlan: "pro",
  subscriptionStatus: "active",
  preferences: {
    emailNotifications: true,
    newsletter: true
  }
}
```

### Subscriptions Collection
```javascript
{
  userId: "user123",
  planId: "pro",
  startDate: Timestamp,
  endDate: Timestamp,
  status: "active",
  autoRenew: true,
  lastBillingDate: Timestamp
}
```

### Purchases Collection
```javascript
{
  userId: "user123",
  projectId: "project123",
  amount: 49.99,
  currency: "USD",
  status: "completed",
  transactionId: "stripe_123",
  timestamp: Timestamp
}
```

### Comments Collection
```javascript
{
  projectId: "project123",
  userId: "user123",
  userName: "John Doe",
  userPhoto: "https://...",
  comment: "Great project!",
  rating: 5,
  timestamp: Timestamp,
  approved: true,
  likes: 0
}
```

### Feedback Collection
```javascript
{
  userId: "user123",
  userEmail: "john@example.com",
  type: "suggestion",
  message: "Great feature!",
  timestamp: Timestamp,
  status: "pending"
}
```

---

## Testing Checklist

- [ ] User can sign in with Google
- [ ] User can sign up with email
- [ ] User profile displays correctly
- [ ] Feedback submission works
- [ ] Comments can be posted (after enabling)
- [ ] Subscription plans display
- [ ] Purchase history shows transactions
- [ ] User can sign out
- [ ] Theme toggle works

---

## Deployment Notes

1. **Environment Variables**: Use environment variables for API keys in production
2. **HTTPS Only**: Always use HTTPS for payment pages
3. **SSL Certificate**: Required for production Firebase
4. **Backend Server**: Consider adding a Node.js/Python backend for:
   - Payment processing logic
   - Email notifications
   - Comment moderation
   - Subscription renewal

---

## Example Backend Structure (Node.js with Express)

```javascript
// server.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, projectId, userId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'usd',
      metadata: {
        projectId,
        userId
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/process-subscription', async (req, res) => {
  const { planId, userId } = req.body;

  try {
    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        { price: PLAN_PRICES[planId] }
      ]
    });

    res.json({ subscriptionId: subscription.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## Resources

- Stripe: https://stripe.com/docs
- PayPal: https://developer.paypal.com/
- Firebase: https://firebase.google.com/docs
- Firestore: https://firebase.google.com/docs/firestore

---

**Ready to implement?** Start with Stripe payments or subscriptions—they're the most commonly needed features!

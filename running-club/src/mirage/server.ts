import { createServer, Model, Factory, Response } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      user: Model,
      run: Model,
      post: Model,
      comment: Model,
    },

    factories: {
      user: Factory.extend({
        id(i: number) { return i + 1; },
        name() { 
          const names = ['Alex Johnson', 'Sarah Chen', 'Mike Rodriguez', 'Emma Wilson', 'David Kim', 'Lisa Thompson', 'Ryan O\'Connor', 'Maya Patel', 'Chris Anderson', 'Sophie Martin'];
          return names[Math.floor(Math.random() * names.length)];
        },
        email() { return `user${Math.floor(Math.random() * 1000)}@example.com`; },
        avatar() {
          return `https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 100000000)}?w=150&h=150&fit=crop&crop=face`;
        },
        totalRuns() { return Math.floor(Math.random() * 50) + 10; },
        totalDistance() { return Math.floor(Math.random() * 500) + 100; },
        averagePace() { return `${Math.floor(Math.random() * 3) + 4}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`; },
        badges() { 
          const allBadges = ['First Run', '5K Finisher', '10K Finisher', 'Marathon Finisher', 'Consistency King', 'Speed Demon', 'Distance Master'];
          const numBadges = Math.floor(Math.random() * 4) + 1;
          return allBadges.slice(0, numBadges);
        },
        isAdmin() { return Math.random() < 0.2; },
        joinedAt() { return new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000); },
      }),

      run: Factory.extend({
        id(i: number) { return i + 1; },
        title() {
          const titles = ['Morning 5K', 'Hill Training', 'Easy Recovery Run', 'Speed Intervals', 'Long Distance Run', 'Trail Adventure', 'Sunset Jog', 'Track Workout'];
          return titles[Math.floor(Math.random() * titles.length)];
        },
        description() {
          const descriptions = [
            'Join us for an energizing morning run through the city parks.',
            'Challenge yourself with hill repeats to build strength.',
            'A relaxed pace run perfect for recovery days.',
            'High-intensity intervals to improve your speed.',
            'Build endurance with this longer distance run.',
            'Explore nature trails with fellow runners.',
            'End your day with a peaceful evening jog.',
            'Track-focused workout for speed development.'
          ];
          return descriptions[Math.floor(Math.random() * descriptions.length)];
        },
        distance() { return Math.floor(Math.random() * 15) + 3; },
        difficulty() {
          const difficulties = ['Easy', 'Moderate', 'Hard', 'Very Hard'];
          return difficulties[Math.floor(Math.random() * difficulties.length)];
        },
        pace() { return `${Math.floor(Math.random() * 3) + 4}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`; },
        location() {
          const locations = ['Central Park', 'Riverside Trail', 'City Marina', 'University Campus', 'Downtown Loop', 'Lakeside Path', 'Mountain Trail', 'Beach Boardwalk'];
          return locations[Math.floor(Math.random() * locations.length)];
        },
        dateTime() { 
          const future = new Date();
          future.setDate(future.getDate() + Math.floor(Math.random() * 30));
          future.setHours(Math.floor(Math.random() * 12) + 6, Math.floor(Math.random() * 60));
          return future;
        },
        maxParticipants() { return Math.floor(Math.random() * 20) + 5; },
        participants() { 
          const numParticipants = Math.floor(Math.random() * 8) + 1;
          return Array.from({length: numParticipants}, (_, i) => i + 1);
        },
        createdBy() { return Math.floor(Math.random() * 10) + 1; },
        image() {
          return `https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 100000000)}?w=400&h=200&fit=crop`;
        },
      }),

      post: Factory.extend({
        id(i: number) { return i + 1; },
        userId() { return Math.floor(Math.random() * 10) + 1; },
        content() {
          const posts = [
            'Just completed my first 10K! Feeling amazing! 🏃‍♀️',
            'Beautiful morning for a run. The sunrise was incredible! 🌅',
            'Hit a new personal record today - 5:30 pace for 5K! 💪',
            'Running with the group today was so motivating. Love this community! ❤️',
            'Rainy day run = best run. Who else loves running in the rain? 🌧️',
            'Rest day today but planning a long run tomorrow. Any route suggestions? 🗺️',
            'Marathon training week 8 complete. Feeling strong! 🏃‍♂️',
            'New running shoes day! Can\'t wait to test them out! 👟'
          ];
          return posts[Math.floor(Math.random() * posts.length)];
        },
        image() {
          return Math.random() > 0.5 ? `https://images.unsplash.com/photo-${1500000000 + Math.floor(Math.random() * 100000000)}?w=400&h=300&fit=crop` : null;
        },
        likes() { return Math.floor(Math.random() * 20); },
        comments() { return Math.floor(Math.random() * 10); },
        createdAt() { return new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); },
      }),

      comment: Factory.extend({
        id(i: number) { return i + 1; },
        postId() { return Math.floor(Math.random() * 15) + 1; },
        userId() { return Math.floor(Math.random() * 10) + 1; },
        content() {
          const comments = [
            'Great job! Keep it up! 👏',
            'Inspiring! I need to get back to running.',
            'Amazing pace! How long have you been training?',
            'Love the dedication! 💪',
            'This motivates me to go for a run today!',
            'Congratulations on the achievement!',
            'Running goals! 🏃‍♀️',
            'Keep pushing those limits!'
          ];
          return comments[Math.floor(Math.random() * comments.length)];
        },
        createdAt() { return new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000); },
      }),
    },

    seeds(server) {
      server.createList('user', 10);
      server.createList('run', 8);
      server.createList('post', 15);
      server.createList('comment', 30);
    },

    routes() {
      this.namespace = 'api';

      // Auth routes
      this.post('/login', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ email }) || schema.users.first();
        return { user, token: 'mock-jwt-token' };
      });

      this.post('/register', (schema, request) => {
        const userData = JSON.parse(request.requestBody);
        const user = schema.users.create(userData);
        return { user, token: 'mock-jwt-token' };
      });

      // User routes
      this.get('/users');
      this.get('/users/:id');
      this.patch('/users/:id');

      // Run routes
      this.get('/runs');
      this.get('/runs/:id');
      this.post('/runs');
      this.patch('/runs/:id');
      this.delete('/runs/:id');
      
      this.post('/runs/:id/join', (schema, request) => {
        const run = schema.runs.find(request.params.id);
        const { userId } = JSON.parse(request.requestBody);
        const participants = run.participants || [];
        if (!participants.includes(userId)) {
          participants.push(userId);
          run.update({ participants });
        }
        return run;
      });

      this.post('/runs/:id/leave', (schema, request) => {
        const run = schema.runs.find(request.params.id);
        const { userId } = JSON.parse(request.requestBody);
        const participants = (run.participants || []).filter((id: number) => id !== userId);
        run.update({ participants });
        return run;
      });

      // Social routes
      this.get('/posts');
      this.post('/posts');
      this.get('/posts/:id/comments');
      this.post('/posts/:id/comments');
      this.post('/posts/:id/like');

      // Tips/Articles
      this.get('/articles', () => {
        return [
          {
            id: 1,
            title: 'The Perfect Running Form',
            excerpt: 'Learn the fundamentals of efficient running technique.',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
            category: 'Technique',
            readTime: '5 min read'
          },
          {
            id: 2,
            title: 'Nutrition for Runners',
            excerpt: 'Fuel your runs with the right nutrition strategies.',
            image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop',
            category: 'Nutrition',
            readTime: '7 min read'
          },
          {
            id: 3,
            title: 'Injury Prevention Tips',
            excerpt: 'Stay healthy and avoid common running injuries.',
            image: 'https://images.unsplash.com/photo-1594736797933-d0c6b6c3ca81?w=400&h=200&fit=crop',
            category: 'Health',
            readTime: '6 min read'
          },
          {
            id: 4,
            title: 'Building Your Training Plan',
            excerpt: 'Create a structured approach to reach your running goals.',
            image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=400&h=200&fit=crop',
            category: 'Training',
            readTime: '8 min read'
          },
        ];
      });
    },
  });
}
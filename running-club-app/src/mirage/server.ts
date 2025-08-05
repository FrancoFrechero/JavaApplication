import { createServer, Response } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    seeds(server) {
      // Create users
      const users = [
        { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', role: 'admin', totalRuns: 45, totalDistance: 320, avgPace: '5:30', badges: ['marathon', 'early-bird', 'streak'] },
        { id: '2', name: 'Mike Chen', email: 'mike@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'user', totalRuns: 32, totalDistance: 180, avgPace: '6:15', badges: ['half-marathon', 'consistency'] },
        { id: '3', name: 'Emma Davis', email: 'emma@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', role: 'user', totalRuns: 28, totalDistance: 150, avgPace: '5:45', badges: ['10k', 'speed-demon'] },
        { id: '4', name: 'Alex Rodriguez', email: 'alex@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', role: 'user', totalRuns: 19, totalDistance: 95, avgPace: '7:00', badges: ['beginner'] },
        { id: '5', name: 'Lisa Wang', email: 'lisa@example.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', role: 'user', totalRuns: 56, totalDistance: 420, avgPace: '5:15', badges: ['ultra', 'trail-runner', 'mentor'] },
        { id: '6', name: 'David Kim', email: 'david@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'user', totalRuns: 23, totalDistance: 125, avgPace: '6:30', badges: ['5k', 'weekend-warrior'] },
        { id: '7', name: 'Rachel Green', email: 'rachel@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'user', totalRuns: 38, totalDistance: 210, avgPace: '5:50', badges: ['half-marathon', 'social-butterfly'] },
        { id: '8', name: 'Tom Wilson', email: 'tom@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', role: 'user', totalRuns: 15, totalDistance: 75, avgPace: '7:30', badges: ['newbie'] },
        { id: '9', name: 'Nina Patel', email: 'nina@example.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', role: 'user', totalRuns: 42, totalDistance: 280, avgPace: '5:40', badges: ['marathon', 'nutrition-expert'] },
        { id: '10', name: 'Chris Brown', email: 'chris@example.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', role: 'user', totalRuns: 29, totalDistance: 165, avgPace: '6:00', badges: ['10k', 'morning-person'] },
      ];

      users.forEach(user => server.create('user', user));

      // Create runs
      const runs = [
        { id: '1', title: 'Morning Trail Run', distance: 8, difficulty: 'moderate', pace: '6:00', location: 'Central Park', time: '2024-01-15T07:00:00Z', participants: ['1', '2', '5'], maxParticipants: 15, description: 'Beautiful morning trail run through Central Park. Perfect for intermediate runners.' },
        { id: '2', title: 'Speed Training', distance: 5, difficulty: 'hard', pace: '4:30', location: 'Track & Field Stadium', time: '2024-01-16T18:00:00Z', participants: ['1', '3', '7'], maxParticipants: 10, description: 'High-intensity interval training session. Bring your A-game!' },
        { id: '3', title: 'Easy Recovery Run', distance: 3, difficulty: 'easy', pace: '7:30', location: 'Riverside Park', time: '2024-01-17T19:00:00Z', participants: ['4', '8', '10'], maxParticipants: 20, description: 'Gentle recovery run for beginners and those coming back from injury.' },
        { id: '4', title: 'Long Distance Saturday', distance: 15, difficulty: 'hard', pace: '6:30', location: 'Hudson River Greenway', time: '2024-01-20T08:00:00Z', participants: ['1', '5', '9'], maxParticipants: 12, description: 'Long distance training run along the Hudson River. Great preparation for upcoming races.' },
        { id: '5', title: 'Social Evening Run', distance: 6, difficulty: 'moderate', pace: '6:15', location: 'Brooklyn Bridge Park', time: '2024-01-18T19:30:00Z', participants: ['2', '6', '7', '10'], maxParticipants: 15, description: 'Social evening run with post-run coffee. All levels welcome!' },
      ];

      runs.forEach(run => server.create('run', run));

      // Create posts
      const posts = [
        { id: '1', userId: '1', content: 'Just completed my longest run ever! 20km in 1:45. Feeling amazing! 🏃‍♀️', likes: 12, comments: 5, createdAt: '2024-01-14T10:30:00Z' },
        { id: '2', userId: '5', content: 'Trail running in the rain is magical. Mud, puddles, and pure joy! 🌧️', likes: 8, comments: 3, createdAt: '2024-01-13T16:45:00Z' },
        { id: '3', userId: '3', content: 'New PR on my 5k today! 18:45 - feeling unstoppable! 💪', likes: 15, comments: 7, createdAt: '2024-01-12T09:15:00Z' },
        { id: '4', userId: '7', content: 'Who\'s joining the Saturday long run? Perfect weather forecast! ☀️', likes: 6, comments: 4, createdAt: '2024-01-11T14:20:00Z' },
        { id: '5', userId: '2', content: 'Recovery day essentials: foam rolling, stretching, and lots of water. Your body will thank you! 💧', likes: 10, comments: 2, createdAt: '2024-01-10T20:00:00Z' },
      ];

      posts.forEach(post => server.create('post', post));

      // Create tips
      const tips = [
        { id: '1', title: 'Proper Running Form', category: 'technique', content: 'Focus on landing midfoot, keep your head up, and maintain a slight forward lean. Good form prevents injuries and improves efficiency.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
        { id: '2', title: 'Nutrition for Runners', category: 'nutrition', content: 'Fuel your runs with a mix of carbs, protein, and healthy fats. Hydrate well before, during, and after your runs.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400' },
        { id: '3', title: 'Recovery Strategies', category: 'recovery', content: 'Rest days are just as important as training days. Include stretching, foam rolling, and adequate sleep in your routine.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
        { id: '4', title: 'Building Endurance', category: 'training', content: 'Gradually increase your weekly mileage by no more than 10%. Consistency is key to building lasting endurance.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
        { id: '5', title: 'Mental Preparation', category: 'mindset', content: 'Visualize your success, set realistic goals, and remember that every run makes you stronger, regardless of pace.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
      ];

      tips.forEach(tip => server.create('tip', tip));
    },

    routes() {
      this.namespace = 'api';

      // Authentication routes
      this.post('/auth/login', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ email });
        
        if (user && password === 'password') {
          return { user, token: 'mock-jwt-token' };
        } else {
          return new Response(401, {}, { error: 'Invalid credentials' });
        }
      });

      this.post('/auth/register', (schema, request) => {
        const { name, email, password } = JSON.parse(request.requestBody);
        const existingUser = schema.users.findBy({ email });
        
        if (existingUser) {
          return new Response(400, {}, { error: 'User already exists' });
        }
        
        const newUser = schema.users.create({
          id: String(schema.users.all().length + 1),
          name,
          email,
          role: 'user',
          totalRuns: 0,
          totalDistance: 0,
          avgPace: '0:00',
          badges: [],
        });
        
        return { user: newUser, token: 'mock-jwt-token' };
      });

      // Users routes
      this.get('/users', (schema) => {
        return schema.users.all();
      });

      this.get('/users/:id', (schema, request) => {
        return schema.users.find(request.params.id);
      });

      // Runs routes
      this.get('/runs', (schema) => {
        return schema.runs.all();
      });

      this.get('/runs/:id', (schema, request) => {
        return schema.runs.find(request.params.id);
      });

      this.post('/runs', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.runs.create(attrs);
      });

      this.patch('/runs/:id', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const run = schema.runs.find(request.params.id);
        return run.update(attrs);
      });

      this.delete('/runs/:id', (schema, request) => {
        const run = schema.runs.find(request.params.id);
        run.destroy();
        return new Response(204);
      });

      // Posts routes
      this.get('/posts', (schema) => {
        return schema.posts.all();
      });

      this.post('/posts', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.posts.create(attrs);
      });

      // Tips routes
      this.get('/tips', (schema) => {
        return schema.tips.all();
      });

      this.get('/tips/:id', (schema, request) => {
        return schema.tips.find(request.params.id);
      });
    },

    models: {
      user: {
        id: 'string',
        name: 'string',
        email: 'string',
        avatar: 'string',
        role: 'string',
        totalRuns: 'number',
        totalDistance: 'number',
        avgPace: 'string',
        badges: 'array',
      },
      run: {
        id: 'string',
        title: 'string',
        distance: 'number',
        difficulty: 'string',
        pace: 'string',
        location: 'string',
        time: 'string',
        participants: 'array',
        maxParticipants: 'number',
        description: 'string',
      },
      post: {
        id: 'string',
        userId: 'string',
        content: 'string',
        likes: 'number',
        comments: 'number',
        createdAt: 'string',
      },
      tip: {
        id: 'string',
        title: 'string',
        category: 'string',
        content: 'string',
        image: 'string',
      },
    },
  });

  return server;
}
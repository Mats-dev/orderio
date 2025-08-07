# OrderIO

OrderIO is a full-stack bar ordering system built with:

- Next.js (React framework)
- Supabase (hosted PostgreSQL backend)
- Vercel (hosting)

## Features

- Customers can browse the menu and place orders
- Kitchen staff can view & update order statuses
- Admin can add and delete menu items

## Getting Started

1. Clone the repository
2. Create a Supabase project and run the SQL script below in Supabase SQL Editor:

```sql
CREATE TABLE menu (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(6, 2) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES menu(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Add your Supabase keys in \`.env.local\`:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

4. Install dependencies:

\`\`\`bash
npm install
\`\`\`

5. Run locally:

\`\`\`bash
npm run dev
\`\`\`

6. Open your browser at http://localhost:3000

## Deploying

Deploy on Vercel by connecting your GitHub repository and adding environment variables for your Supabase keys.

---

## License

MIT

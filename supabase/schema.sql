-- Create a table for public profiles using Supabase auth
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  bio text,
  about_markdown text,
  social_links jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for projects
create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  image_url text,
  tech_stack text[],
  repo_url text,
  live_url text,
  display_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for projects
alter table projects enable row level security;

create policy "Projects are viewable by everyone." on projects
  for select using (true);

create policy "Users can insert their own projects." on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update own projects." on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete own projects." on projects
  for delete using (auth.uid() = user_id);

-- Create a storage bucket for 'portfolio-assets'
insert into storage.buckets (id, name, public) 
values ('portfolio-assets', 'portfolio-assets', true);

-- Storage policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'portfolio-assets' );
create policy "Auth users can upload" on storage.objects for insert with check ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );
create policy "Auth users can update" on storage.objects for update with check ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );
create policy "Auth users can delete" on storage.objects for delete using ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nynnpvnzacpshjhkkkpt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bm5wdm56YWNwc2hqaGtra3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwOTgzOTUsImV4cCI6MjA2OTY3NDM5NX0.yKHHfixe3kOwU6kP0Z0eh_-k2hBKRpXHxaefxcVGl9c';
export const supabase = createClient(supabaseUrl, supabaseKey);
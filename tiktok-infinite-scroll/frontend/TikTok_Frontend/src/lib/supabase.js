// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dodofbnyygrggmhndwri.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZG9mYm55eWdyZ2dtaG5kd3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzOTk2MTUsImV4cCI6MjA5Mzk3NTYxNX0.gyiCKkL0X_ImeM6e0UkgCcUmexU4GPVGDPwp7WaA9ck';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected successfully to new project');
  }
});

export default supabase;
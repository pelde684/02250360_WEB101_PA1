// TikTok_Server/src/lib/supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dodofbnyygrggmhndwri.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZG9mYm55eWdyZ2dtaG5kd3JpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODM5OTYxNSwiZXhwIjoyMDkzOTc1NjE1fQ.EHAJuoZ558GiNxptEAB-GQn6wIXa9qNkXgJM-PDVR2U';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
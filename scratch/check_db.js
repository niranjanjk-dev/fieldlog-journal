const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lgieoxjunpbuershmhkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnaWVveGp1bnBidWVyc2htaGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NjM2NjgsImV4cCI6MjEwMjMzOTY2OH0.ya5-d9KzIK6XKVx9dt6GjRn6-n3eorG7haveSJ-SkII';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInstitutions() {
  const { data, error } = await supabase.from('institutions').select('*');
  console.log('Institutions:', data);
  if (error) console.error('Error:', error);
}

checkInstitutions();

-- Update the Auckland van hire blog post FAQ section
UPDATE public.blog_articles 
SET content = REPLACE(
  REPLACE(
    REPLACE(
      content,
      'A: All rentals include comprehensive insurance, unlimited kilometers within Auckland region, and 24/7 roadside assistance.',
      'A: All rentals include comprehensive insurance, unlimited kilometres, and 24/7 roadside assistance.'
    ),
    '### Q: Is there a minimum rental period?
A: Our minimum rental is 3 hours for 12-seater vans in Auckland.

',
    ''
  ),
  'A: We provide advice on parking locations and can arrange dedicated parking for longer city stays.',
  'A: We provide advice on parking locations for your convenience.'
)
WHERE slug = '12-seater-van-hire-auckland-complete-guide-group-transport';
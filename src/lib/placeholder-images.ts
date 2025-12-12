// Placeholder images for trip cards
export const getPlaceholderImage = (tripName: string) => {
  const images = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&crop=center', // Travel
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center', // Mountains
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center', // Nature
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop&crop=center', // Beach
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center', // City
    'https://images.unsplash.com/photo-1464822759844-d150baec5b2b?w=400&h=300&fit=crop&crop=center', // Adventure
  ];

  // Use trip name to get consistent image for same trip
  const hash = tripName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return images[Math.abs(hash) % images.length];
};

export const getCountryImage = (country: string) => {
  const countryImages: { [key: string]: string } = {
    'Egypt': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&crop=center',
    'Turkey': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop&crop=center',
    'Thailand': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop&crop=center',
    'Indonesia': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop&crop=center',
    'Georgia': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    'Slovenia': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
  };

  return countryImages[country] || getPlaceholderImage(country);
};

// Configuración de la ubicación del negocio
export const businessLocation = {
  address: 'Calle 30 # 73-26, Medellín, Antioquia, Colombia',
  phone: '+57 313 792 84 83',
  email: 'simonuwusierra@gmail.com',
  hours: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
  // Coordenadas para Google Maps
  lat: 6.231625393769719,
  lng: -75.59377863971152,
  // API Key de Google Maps (configurar en .env.local)
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
};

// Imagen por defecto para reseñas sin avatar
export const defaultAvatar = 'https://static.vecteezy.com/system/resources/previews/002/387/693/non_2x/user-profile-icon-free-vector.jpg';

export const reviews = [
  {
    id: 1,
    name: 'María González',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Con el servicio de El Vitral he podido renovar mis ventanas con mucha confianza y tranquilidad. Atención muy profesional.',
    timeAgo: 'hace 6 días',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    avatar: '', 
    rating: 5,
    comment: 'Excelente trabajo en la fachada comercial. El equipo cumplió tiempos y el acabado quedó impecable.',
    timeAgo: 'hace 10 días',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Ana López',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Recomiendo mucho a El Vitral. Instalación rápida y el vidrio es de muy buena calidad.',
    timeAgo: 'hace 14 días',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Pedro Martínez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Atención excelente y el resultado final superó mis expectativas. Siempre pendientes del detalle.',
    timeAgo: 'hace 3 semanas',
    source: 'Google',
  },
];
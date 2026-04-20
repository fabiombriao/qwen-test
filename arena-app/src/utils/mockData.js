// Mock de dados para desenvolvimento
export const mockSports = [
  { id: 1, name: 'Futebol', icon: '⚽', color: '#2563eb' },
  { id: 2, name: 'Vôlei', icon: '🏐', color: '#f59e0b' },
  { id: 3, name: 'Basquete', icon: '🏀', color: '#ef4444' },
  { id: 4, name: 'Tênis', icon: '🎾', color: '#10b981' },
  { id: 5, name: 'Futsal', icon: '⚽', color: '#8b5cf6' },
  { id: 6, name: 'Beach Tennis', icon: '🏖️', color: '#06b6d4' }
];

export const mockCourts = [
  { id: 1, name: 'Quadra 1', sport: 'Futebol', capacity: 10, price: 150 },
  { id: 2, name: 'Quadra 2', sport: 'Futebol', capacity: 10, price: 150 },
  { id: 3, name: 'Quadra 3', sport: 'Vôlei', capacity: 12, price: 120 },
  { id: 4, name: 'Quadra 4', sport: 'Basquete', capacity: 10, price: 140 },
  { id: 5, name: 'Quadra 5', sport: 'Tênis', capacity: 4, price: 100 },
  { id: 6, name: 'Quadra 6', sport: 'Beach Tennis', capacity: 4, price: 110 }
];

export const generateTimeSlots = (date) => {
  const slots = [];
  const startHour = 7; // 7h da manhã
  const endHour = 23; // 23h da noite
  
  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    const isPromotion = hour >= 7 && hour <= 10; // Promoção manhã
    const isUnavailable = Math.random() > 0.7; // 30% indisponível
    
    slots.push({
      id: `${date}-${time}`,
      time,
      available: !isUnavailable,
      promotion: isPromotion,
      price: isPromotion ? 100 : 150
    });
  }
  
  return slots;
};

export const mockReservations = [
  {
    id: '1',
    userId: '1',
    courtId: 1,
    date: '2024-01-15',
    time: '19:00',
    status: 'confirmed',
    totalValue: 150,
    paidValue: 75,
    balance: 75,
    items: []
  },
  {
    id: '2',
    userId: '1',
    courtId: 3,
    date: '2024-01-10',
    time: '20:00',
    status: 'completed',
    totalValue: 120,
    paidValue: 120,
    balance: 0,
    items: [
      { id: 1, name: 'Cerveja', quantity: 6, price: 8 },
      { id: 2, name: 'Água', quantity: 4, price: 5 }
    ]
  }
];

export const mockBarProducts = [
  { id: 1, name: 'Cerveja Lata', price: 8, category: 'Bebidas' },
  { id: 2, name: 'Cerveja 600ml', price: 12, category: 'Bebidas' },
  { id: 3, name: 'Refrigerante', price: 6, category: 'Bebidas' },
  { id: 4, name: 'Água', price: 5, category: 'Bebidas' },
  { id: 5, name: 'Suco', price: 7, category: 'Bebidas' },
  { id: 6, name: 'Hambúrguer', price: 25, category: 'Lanches' },
  { id: 7, name: 'Batata Frita', price: 18, category: 'Lanches' },
  { id: 8, name: 'Nuggets', price: 20, category: 'Lanches' },
  { id: 9, name: 'Açaí', price: 15, category: 'Sobremesas' }
];

export const mockStats = {
  dailyRevenue: 2450,
  monthlyRevenue: 45800,
  dailyOccupancy: 75,
  monthlyOccupancy: 68,
  activeReservations: 12,
  pendingPayments: 3
};

export const mockClients = [
  { 
    id: '1', 
    name: 'João Silva', 
    phone: '(11) 99999-1111', 
    visits: 25, 
    totalSpent: 3500,
    lastVisit: '2024-01-10',
    tags: ['Recorrente', 'Nível A']
  },
  { 
    id: '2', 
    name: 'Maria Santos', 
    phone: '(11) 99999-2222', 
    visits: 5, 
    totalSpent: 600,
    lastVisit: '2024-01-08',
    tags: ['Aleatório']
  },
  { 
    id: '3', 
    name: 'Pedro Oliveira', 
    phone: '(11) 99999-3333', 
    visits: 50, 
    totalSpent: 8000,
    lastVisit: '2024-01-12',
    tags: ['Permanente', 'Nível A']
  }
];

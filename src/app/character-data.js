const CharacterData = {
    colors: {
        skin: ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#C68642'],
        hair: ['#090806', '#2C1608', '#4E2708', '#B55239', '#D6C4C2', '#4B1910', '#E5C09B'],
        eyes: ['#2D2926', '#3E2723', '#1B5E20', '#0D47A1', '#4E342E'],
        clothes: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444']
    },
    
    parts: {
        face: [
            { id: 'face-1', name: 'Original', path: '<path d="M100,100 Q100,50 200,50 Q300,50 300,100 L300,300 Q300,400 200,400 Q100,400 100,300 Z" fill="currentColor" />' },
            { id: 'face-2', name: 'Sharp', path: '<path d="M100,100 L200,50 L300,100 L300,300 L200,400 L100,300 Z" fill="currentColor" />' },
            { id: 'face-3', name: 'Round', path: '<circle cx="200" cy="225" r="150" fill="currentColor" />' }
        ],
        eyes: [
            { id: 'eyes-1', name: 'Dot', path: '<circle cx="150" cy="200" r="10" /><circle cx="250" cy="200" r="10" />' },
            { id: 'eyes-2', name: 'Square', path: '<rect x="140" y="190" width="20" height="20" /><rect x="240" y="190" width="20" height="20" />' },
            { id: 'eyes-3', name: 'Closed', path: '<path d="M130,200 Q150,220 170,200" fill="none" stroke="currentColor" stroke-width="4" /><path d="M230,200 Q250,220 270,200" fill="none" stroke="currentColor" stroke-width="4" />' }
        ],
        mouth: [
            { id: 'mouth-1', name: 'Smile', path: '<path d="M170,300 Q200,330 230,300" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />' },
            { id: 'mouth-2', name: 'Flat', path: '<line x1="170" y1="310" x2="230" y2="310" stroke="currentColor" stroke-width="4" stroke-linecap="round" />' },
            { id: 'mouth-3', name: 'Surprised', path: '<circle cx="200" cy="310" r="10" fill="none" stroke="currentColor" stroke-width="4" />' }
        ],
        hair: [
            { id: 'hair-1', name: 'Bowl', path: '<path d="M100,120 Q100,50 200,50 Q300,50 300,120 L300,180 L100,180 Z" fill="currentColor" />' },
            { id: 'hair-2', name: 'Spiky', path: '<path d="M100,180 L100,120 L130,50 L160,100 L200,30 L240,100 L270,50 L300,120 L300,180 Z" fill="currentColor" />' },
            { id: 'hair-3', name: 'Bald', path: '' }
        ]
    }
};

if (typeof module !== 'undefined') {
    module.exports = CharacterData;
}

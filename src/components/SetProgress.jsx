export default function SetProgress({ cards }) {
    const collected = cards.filter(card =>
      card.standard || card.reverseHolo || card.holoFoil || card.pokeball || card.masterball
    ).length;
  
    return (
      <div className="text-sm text-blue-600 font-medium">
        Collected: {collected} / {cards.length}
      </div>
    );
  }  
// components/PrintableListWrapper.jsx
export default function PrintableListWrapper({ cards }) {
  return (
    <div className="print-page">
      {cards.map(card => (
        <div key={card.name + card.number} className="print-card">
          <p><strong>{card.name}</strong> #{card.number} - {card.rarity} ({card.setName})</p>
        </div>
      ))}
    </div>
  );
}

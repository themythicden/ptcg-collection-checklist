import Card from './Card';

export default function Checklist({ cards }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map(card => (
        <Card key={card.name} card={card} />
      ))}
    </div>
  );
}
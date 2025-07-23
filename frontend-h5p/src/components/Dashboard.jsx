import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h1>Tableau de bord</h1>
      <Link to="/create"><button>Créer une leçon</button></Link>
      <Link to="/library"><button>Ma bibliothèque</button></Link>
      <button>Aide</button>
    </div>
  );
}

const mockLessons = [
  { id: 1, title: "Leçon 1", shared: false },
  { id: 2, title: "Leçon 2", shared: true },
];

export default function Library() {
  return (
    <div>
      <h2>Ma bibliothèque</h2>
      {mockLessons.map((lesson) => (
        <div key={lesson.id}>
          <strong>{lesson.title}</strong> ({lesson.shared ? "Partagée" : "Privée"})
          <button>Exporter</button>
          <button>Partager</button>
        </div>
      ))}
    </div>
  );
}

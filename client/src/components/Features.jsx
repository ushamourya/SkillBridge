const features = [
  "AI Career Guidance",
  "Personalized Roadmap",
  "Skill Gap Detection",
  "Interview Preparation",
];

export default function Features() {
  return (
    <div className="grid grid-cols-2 gap-6 px-10 mt-24">

      {features.map((item, i) => (
        <div key={i} className="glass">
          {item}
        </div>
      ))}

    </div>
  );
}
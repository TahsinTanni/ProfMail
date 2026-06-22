export default function ProfessorPixelArt() {
  return (
    <>
      <style>{`
        @keyframes professorFloat {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .professor-float-wrapper {
          animation: professorFloat 3s ease-in-out infinite;
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }
        .professor-avatar {
          width: 200px;
          height: 200px;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
      <div className="professor-float-wrapper">
        <img
          src="/avatar.png"
          alt="Pixel art professor"
          className="professor-avatar"
        />
      </div>
    </>
  );
}

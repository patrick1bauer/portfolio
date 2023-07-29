import ThreeScene from "@/components/ThreeScene";

export default function Home() {
  return (
    <div className="home">
      <div id="blocker">
        <div id="instructions">
          <p>Click to Explore</p>
          <p>
            Move: WASD
            <br />
            Jump: SPACE
            <br />
            Look: MOUSE
          </p>
        </div>
      </div>
      <ThreeScene />
    </div>
  );
}

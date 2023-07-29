import SideNav from "@/components/SideNav";
import ThreeScene from "@/components/ThreeScene";

export default function Home() {
  return (
    <>
      <div id="loadingscreen">
        <div id="loader-wrapper">
          <div class="title">Welcome!</div>
          <div id="progress">
            <span id="loading">Loading...</span>
            <div id="progress-bar" />
          </div>
          <button class="button cta" id="start-button" href="#start">
            Enter
          </button>
        </div>
      </div>

      <div id="logo">
        Patrick
        <br />
        Bauer
      </div>

      <SideNav />

      <div id="blocker">
        <div id="instructions">
          <p>Click to Explore</p>
          <p>
            Move: WASD or Arrow Keys
            <br />
            Jump: SPACE
            <br />
            Look: MOUSE
          </p>
        </div>
      </div>
      <ThreeScene />
    </>
  );
}

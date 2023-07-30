import SideNav from "@/components/SideNav";
import ThreeScene from "@/components/ThreeScene";

export default function Home() {
  return (
    <>
      <div id="loadingscreen">
        <div id="loader-wrapper">
          <div id="home-title">Patrick Bauer</div>
          <h1 id="home-description">
            Software Engineer, World Traveler, EDM Enthusiast
          </h1>
          <div id="progress">
            <span id="loading">Loading...</span>
            <div id="progress-bar" />
          </div>
          <button className="button cta" id="start-button" href="#start">
            Click to Explore
          </button>
        </div>
        <SideNav />
      </div>

      <div id="logo">
        Patrick
        <br />
        Bauer
      </div>

      <div id="home-instructions">
        <p>Move: WASD or Arrow Keys</p>
        <p>Jump: Space</p>
        <p>Look: Mouse</p>
        <p>Leave: ESC</p>
      </div>

      <ThreeScene />
    </>
  );
}

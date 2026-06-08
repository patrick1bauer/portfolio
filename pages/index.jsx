import CopyText from '@/components/CopyText';

export default function Home() {
  return (
    <div className="div-component">
      <div className="div-content">
        <div id="home-title">Patrick Bauer</div>
        <img src="pictures/Profile_Picture.webp" alt="Profile Picture" />
        <h1 id="home-description">Software Engineer, World Traveler</h1>

        <h1>Bleeding-Edge Projects</h1>

        <h2>Cross Currency Global Mass Payments <a href="https://www.jpmorgan.com/payments/payments-and-cross-currency-solutions/cross-currency-solutions" target="_blank">@JPMorgan Chase & Co.</a></h2>
        <div className="div-detailsinside">
          <br />
          <h3>Software Engineer II, July 2022 - Present</h3>
          <br />
          <ul>
            <li>Projects: Global Mass Payments, Brazil Insourcing, Brazil Outsourcing, Chile Modernization, Brazil QR Payments, Chile incoming & outgoing wires, Chile tax payments.</li>
            <li>Application Owner - Java Springboot payment router to send Brazil pay-out transactions for sanctions, funds control, and reporting deployed on Kubernetes.</li>
            <li>Release Lead - Managed release cuts, regression testing, and stakeholder communication for major global code releases.</li>
            <li>Tech Lead - Owned projects end to end from translating requirements from business analysts to actionable Jira tickets for the team to work, to deploying completed features and supporting the testing team.</li>
            <li>Engineered custom Model Context Protocol (MCP) servers and AI agents to automate software development life cycle workflows, integrating Jira, Confluence, and Bitbucket to streamline epic analysis, story creation, documentation review, and PR management.</li>
            <li>Created Java applications for collecting and storing client information and reference data for Brazil QR code payments.</li>
            <li>Designed scalable, robust, Java Spring Boot apps deployed on Kubernetes, AWS, and On-premise servers using Jules CI/CD</li>
            <li>Saved thousands of hours of manual testing time by implementing new REST API endpoints to Cross-Border payments apps to enable automated regression testing using Gherkin and Cucumber.</li>
            <li>Implemented regression test suite from scratch to ensure Chile outgoing wires, incoming wires, and tax payment code changes meet business requirements.</li>
            <li>Achieved unit test code coverage of 100% using JUnit framework for all new Java code.</li>
            <li>DevOps: Provisioned Kubernetes infrastructure for the team's development, testing, and production environments.</li>
          </ul>
        </div>

        <h2>Missile Defense Systems <a href="https://www.rtx.com/raytheon/what-we-do/strategic-missile-defense" target="_blank">@Cummings Aerospace / Raytheon</a></h2>
        <div className="div-detailsinside">
          <br />
          <h3>Software Engineer, August 2021 - June 2022</h3>
          <br />
          <ul>
            <li>Developed and tested software for Raytheon Missles & Defense systems.</li>
            <li>Implemented microservices architecture using abstract REST APIs to handle communication using Python and C++.</li>
            <li>Designed regression tests using gherkin & BDD framework and implemented unit tests using C++ & Google Test.</li>
            <li>Implemented real-time secure networking messages between embedded Linux systems using modern C++ and multithreading.</li>
            <li>Increased test server efficiency by 87.5% by dynamically allocating hardware using Python and MySQL.</li>
            <li>Acted as backup scrum master for my software development team.</li>
            <li>Used GitHub & Bitbucket for version control, Jenkins for automated building & testing, and Jira for agile project management.</li>
          </ul>
        </div>

        <h2>Navy Flight Simulators <a href="https://www.navair.navy.mil/nawctsd/" target="_blank">@NAVAIR</a></h2>
        <div className="div-detailsinside">
          <br />
          <h3>Junior Software Developer, March 2020 - November 2020</h3>
          <br />
          <ul>
            <li>Designed, implemented, and tested new features for internal application tools using Java. Created specification documentation.</li>
            <li>Used SVN for version control and Jira for agile project management.</li>
          </ul>
        </div>

        <h2>Autonomous Search With AI <a href="https://github.com/patrick1bauer" target ="_blank">@UCF / Lockheed Martin</a></h2>
        <div className="div-detailsinside">
          <br />
          <h3>Team Lead & Machine Learning, August 2020 - May 2021</h3>
          <br />
          <ul>
            <li>UCF Senior Design Project sponsored by Lockheed Martin</li>
            <li>Real-time Object Detection Simulation (Gazebo)</li>
            <li>Machine Learning & Autonomous Navigation (Python)</li>
          </ul>
        </div>

        <h2>FAA Certified Drone Pilot <a href="http://www.affordabledronephotography.com/" target="_blank">@Affordable Drone Photography</a></h2>
        <div className="div-detailsinside">
          <br />
          <h3>Founder, January 2016 - March 2020</h3>
          <br />
          <ul>
            <li>Website Development - Designed and maintained a website using HTML and CSS.</li>
            <li>Drone Pilot - FAA-certified Unmanned Aerial Systems Remote Pilot.</li>
          </ul>
        </div>

        <h1>Education</h1>
        
        <h2>AWS Certified Cloud Practitioner <a href="https://www.credly.com/badges/10a4e777-84f9-4dbc-8cea-93b7c7bbdd7b/linked_in_profile" target="_blank">@AWS</a></h2>

        <h2>BS in Computer Science <a href="https://www.ucf.edu/" target="_blank">@University of Central Florida</a></h2>
        <br />
        <div className="div-detailsinside">
          <ul>
            <li>GPA: 3.93</li>
            <li>President's Honor Roll (4.0 GPA) Summer 2019</li>
            <li>President's Honor Roll (4.0 GPA) Fall 2019</li>
            <li>President's Honor Roll (4.0 GPA) Spring 2020</li>
            <li>Dean's List (&gt;3.5 GPA) Summer 2020</li>
            <li>President's Honor Roll (4.0 GPA) Fall 2020</li>
            <li>Dean's List (&gt;3.5 GPA) Spring 2021</li>
          </ul>
        </div>

        <h2>AS in Computer Programming & Analysis <a href="https://www.fsw.edu/" target="_blank">@Florida SouthWestern State College</a></h2>
        <br />
        <div className="div-detailsinside">
          <ul>
            <li>GPA: 3.94</li>
            <li>Dean's List Fall 2018</li>
            <li>Dean's List Spring 2019</li>
          </ul>
        </div>

        <h1>World Travels</h1>
        <h2>USA, Mexico, Canada, Peru, South Africa, Poland, Czechia, United Kingdom, Germany, Austria, Spain, Hungary, Switzerland, Italy, Romania, France, Belgium, Netherlands, Turkey, Dominican Republic, Argentina</h2>

        <h1>Let's Connect</h1>
        <h2><CopyText text="+1 (239) 961-9175" feedbackMessage="Phone copied to clipboard!"/></h2>
        <h2><CopyText text="patrick1bauer@gmail.com" feedbackMessage="Email copied to clipboard!"/></h2>
        <h2><a href="https://www.linkedin.com/in/patrickbauer/" target="_blank">linkedin.com/in/patrickbauer</a></h2>
        <h2><a href="https://github.com/patrick1bauer" target="_blank">github.com/patrick1bauer</a></h2>
        <h2><a href="pdfs/Patrick_Bauer_Resume.pdf" download="Patrick_Bauer_Resume.pdf">Download my Resume</a></h2>

      </div>
    </div>
  );
}

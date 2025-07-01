import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from '../pages/Home.js';
import AboutPage from '../pages/AboutPage.js';
import LoginPage from '../pages/LoginPage.js';
import Dashbord from '../pages/Dashboard.js'; // Assuming you have a Dashboard page
import FreelancerHome from '../pages/FreelancerHome.js'; // Assuming you have a Freelancer Home page
import JobPosterHome from '../pages/JobPosterHome.js'; // Assuming you have a Job
import FreelancerProfile from '../pages/FreelancerProfile.js';
import FreelancerJobs from '../pages/FreelancerJobs.js'; // Assuming you have a Freelancer Jobs page
import FreelancerServices from '../pages/FreelancerServices.js'; // Assuming you have a Freelancer
import FreelancerProjects from '../pages/FreelancerProjects.js'; // Assuming you have a Freelancer Projects page
import FreelancersingleProject from '../pages/FreelancersingleProjects.js'; // Assuming you have a Freelancer Documents page
import FreelancerprojectApply from '../pages/ProjectApplication.js'; // Assuming you have a Freelancer Project Apply page 
import FreelancerDocuments from '../pages/FreelancerDocuments.js'; // Assuming you have a Freelancer Documents page
import JobPosterProfile from '../pages/JobPosterProfile.js';
import JobPosterJobs from '../pages/JobPosterjobs.js';
import JobposterFreelancer from '../pages/JobPosterFreelancer.js'; // Assuming you have a Job Poster Freelancer page
import JobPosterProjects from '../pages/JobPosterProjects.js'; // Assuming you have a Job Poster Projects page
import JobPostersingleJobs from '../pages/JobPostersingleJobs.js'; // Assuming you have a Job Poster Jobs pag
import Support from '../pages/Support.js'; // Assuming you have a Support page
function Navigation() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Links */}
        

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashbord />} />
          <Route path='/support' element={<Support />} />
          <Route path="/freelancer" element={<FreelancerHome />} />
          <Route path="/jobposter" element={<JobPosterHome />} />   
          <Route path="/freelancer/profile" element={<FreelancerProfile />} />
          <Route path="/freelancer/jobs" element={<FreelancerJobs />} />
          <Route path="/freelancer/services" element={<FreelancerServices />} />
        <Route path="/freelancer/projects" element={<FreelancerProjects />} />
          <Route path="/freelancer/projects/:projectId" element={<FreelancersingleProject />} />
          <Route path="/apply/:projectId" element={<FreelancerprojectApply />} />
          <Route path="/freelancer/documents" element={<FreelancerDocuments />} />
          <Route path="/jobposter/profile" element={<JobPosterProfile />} />
          <Route path="/jobposter/jobs" element={<JobPosterJobs />} />
          <Route path="/jobposter/freelancers" element={<JobposterFreelancer />} />
          <Route path="/jobposter/projects/:projectId" element={<JobPosterProjects />} />
          <Route path="/jobposter/jobs/:jobId" element={<JobPostersingleJobs />} />

          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default Navigation;

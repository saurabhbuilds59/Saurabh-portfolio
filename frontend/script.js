/* ==========================================================================
   SAURABH SEN - PORTFOLIO INTERACTION ENGINE (script.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  /* ==========================================
     1. Loader Animation Progress
     ========================================== */
  const loader = document.getElementById("app-loader");
  const progress = document.getElementById("loader-progress-bar");
  const statusText = document.getElementById("loader-status");
  
  const statuses = [
    "Initializing Neural Networks...",
    "Compiling Full-Stack Modules...",
    "Establishing Portals...",
    "Structuring Database Records...",
    "Uplinking to GitHub Nodes...",
    "Welcome to Saurabh Sen's Universe!"
  ];
  
  let pct = 0;
  let statusIdx = 0;
  
  const loadInterval = setInterval(() => {
    pct += Math.floor(Math.random() * 15) + 5;
    if (pct >= 100) {
      pct = 100;
      clearInterval(loadInterval);
      
      // Complete loading and fade out loader
      progress.style.width = "100%";
      statusText.innerText = statuses[statuses.length - 1];
      
      setTimeout(() => {
        loader.classList.add("opacity-0", "pointer-events-none");
        document.body.classList.remove("overflow-hidden");
      }, 600);
    } else {
      progress.style.width = pct + "%";
      // Update status text progressively
      if (pct > (statusIdx + 1) * (100 / statuses.length) && statusIdx < statuses.length - 2) {
        statusIdx++;
        statusText.innerText = statuses[statusIdx];
      }
    }
  }, 100);


  /* ==========================================
     2. Interactive Star/Particle Constellation
     ========================================== */
  const canvas = document.getElementById("cyber-particles");
  const ctx = canvas.getContext("2d");
  
  let particles = [];
  const maxParticles = window.innerWidth < 768 ? 40 : 100;
  const connectionDist = 120;
  
  let mouse = { x: null, y: null, active: false };
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce boundaries
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      
      // Gravitate slightly to mouse position if nearby
      if (mouse.active && mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          this.x += dx * 0.01;
          this.y += dy * 0.01;
        }
      }
    }
    
    draw() {
      // Color matches dark/light mode accent color
      const isLight = document.body.classList.contains("light-mode");
      ctx.fillStyle = isLight ? "rgba(59, 130, 246, 0.45)" : "rgba(0, 229, 255, 0.45)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function initParticles() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
  }
  
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const isLight = document.body.classList.contains("light-mode");
    const lineColor = isLight ? "rgba(59, 130, 246, 0.06)" : "rgba(0, 229, 255, 0.06)";
    
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDist) {
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1 - (distance / connectionDist);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
    mouse.active = false;
  });
  
  initParticles();
  animateParticles();


  /* ==========================================
     3. Custom Cursor Tracker & Sizing
     ========================================== */
  const cursorDot = document.getElementById("custom-cursor-dot");
  const cursorCircle = document.getElementById("custom-cursor-circle");
  
  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    // Smooth position updates
    if (cursorDot && cursorCircle) {
      cursorDot.style.left = posX + "px";
      cursorDot.style.top = posY + "px";
      
      cursorCircle.animate({
        left: posX + "px",
        top: posY + "px"
      }, { duration: 250, fill: "forwards" });
    }
  });
  
  // Transform cursor on hover of interactive nodes
  const interactives = document.querySelectorAll("a, button, input, textarea, .endorse-tag, .project-filter-btn");
  interactives.forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursorCircle.classList.add("w-14", "h-14", "border-cyber-blue");
      cursorCircle.classList.remove("w-10", "h-10", "border-cyber-purple/60");
      cursorDot.classList.add("scale-[2.5]", "bg-cyber-purple");
    });
    el.addEventListener("mouseleave", () => {
      cursorCircle.classList.add("w-10", "h-10", "border-cyber-purple/60");
      cursorCircle.classList.remove("w-14", "h-14", "border-cyber-blue");
      cursorDot.classList.remove("scale-[2.5]", "bg-cyber-purple");
    });
  });


  /* ==========================================
     4. Text Typing Effect
     ========================================== */
  const typingTextEl = document.getElementById("typing-text");
  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Node.js Developer",
    "React Developer",
    "Next.js Developer",
    "AI & Data Science Student"
  ];
  
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function typeRole() {
    const currentRole = roles[roleIdx];
    
    if (isDeleting) {
      typingTextEl.innerText = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50; // deleting speed faster
    } else {
      typingTextEl.innerText = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100; // standard typing speed
    }
    
    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Hold full word for 2s
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 500; // Brief delay before next word
    }
    
    setTimeout(typeRole, typingSpeed);
  }
  
  if (typingTextEl) {
    setTimeout(typeRole, 1000);
  }


  /* ==========================================
     5. Interactive 3D Perspective Box Tilt
     ========================================== */
  const box3d = document.getElementById("interactive-3d-box");
  const coordTracker = document.getElementById("tracker-coords");
  
  if (box3d) {
    box3d.addEventListener("mousemove", (e) => {
      const rect = box3d.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within element
      const y = e.clientY - rect.top;  // y coordinate within element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation angles (max 15 degrees)
      const rotateX = -(15 * (y - height/2) / (height/2)).toFixed(1);
      const rotateY = (15 * (x - width/2) / (width/2)).toFixed(1);
      
      box3d.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      
      if (coordTracker) {
        coordTracker.innerText = `RX_ROT: ${rotateX}° / RY_ROT: ${rotateY}°`;
      }
    });
    
    box3d.addEventListener("mouseleave", () => {
      // Spring back smooth
      box3d.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      if (coordTracker) {
        coordTracker.innerText = `RX_ROT: 0° / RY_ROT: 0°`;
      }
    });
  }


  /* ==========================================
     6. Navigation Links Scroll Observer
     ========================================== */
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  
  const sectionObserverOptions = {
    root: null,
    threshold: 0.3,
    rootMargin: "-20% 0px -40% 0px"
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        
        // Desktop nav highlights
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active-nav-link", "text-cyber-blue");
            link.classList.remove("text-cyber-muted");
          } else {
            link.classList.remove("active-nav-link", "text-cyber-blue");
            link.classList.add("text-cyber-muted");
          }
        });

        // Mobile list highlights
        mobileNavLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("text-cyber-blue");
            link.classList.remove("text-cyber-muted");
          } else {
            link.classList.remove("text-cyber-blue");
            link.classList.add("text-cyber-muted");
          }
        });
      }
    });
  }, sectionObserverOptions);
  
  sections.forEach(sec => sectionObserver.observe(sec));


  /* ==========================================
     7. Mobile Hamburguer Drawer Menu
     ========================================== */
  const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeHamburgerIcon = document.getElementById("close-hamburger-icon");
  
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.contains("h-96");
      
      if (isOpen) {
        mobileDrawer.classList.remove("h-96", "opacity-100", "py-8");
        mobileDrawer.classList.add("h-0", "opacity-0");
        hamburgerIcon.classList.remove("hidden");
        closeHamburgerIcon.classList.add("hidden");
      } else {
        mobileDrawer.classList.remove("h-0", "opacity-0");
        mobileDrawer.classList.add("h-96", "opacity-100", "py-8");
        hamburgerIcon.classList.add("hidden");
        closeHamburgerIcon.classList.remove("hidden");
      }
    });
    
    // Close mobile drawer on clicking anchor links
    const dLinks = mobileDrawer.querySelectorAll("a");
    dLinks.forEach(dl => {
      dl.addEventListener("click", () => {
        mobileDrawer.classList.remove("h-96", "opacity-100", "py-8");
        mobileDrawer.classList.add("h-0", "opacity-0");
        hamburgerIcon.classList.remove("hidden");
        closeHamburgerIcon.classList.add("hidden");
      });
    });
  }


  /* ==========================================
     8. Theme Switcher (Dark / Light)
     ========================================== */
  const themeToggleBtn = document.getElementById("theme-toggle");
  const darkIcon = document.getElementById("theme-icon-dark");
  const lightIcon = document.getElementById("theme-icon-light");
  
  // Set default theme from localStorage
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    document.documentElement.classList.add("light");
    darkIcon.classList.add("hidden");
    lightIcon.classList.remove("hidden");
  } else {
    document.body.classList.remove("light-mode");
    document.documentElement.classList.remove("light");
    darkIcon.classList.remove("hidden");
    lightIcon.classList.add("hidden");
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isLightNow = document.body.classList.toggle("light-mode");
      document.documentElement.classList.toggle("light", isLightNow);
      
      if (isLightNow) {
        localStorage.setItem("theme", "light");
        darkIcon.classList.add("hidden");
        lightIcon.classList.remove("hidden");
      } else {
        localStorage.setItem("theme", "dark");
        darkIcon.classList.remove("hidden");
        lightIcon.classList.add("hidden");
      }
    });
  }


  /* ==========================================
     9. Scroll Progress Indicator & Header BG
     ========================================== */
  const header = document.getElementById("cyber-header");
  const progressBar = document.getElementById("scroll-progress");
  
  window.addEventListener("scroll", () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    
    if (progressBar) {
      progressBar.style.width = scrolled + "%";
    }
    
    // Blur header background on scroll
    if (header) {
      if (windowScroll > 50) {
        header.classList.add("bg-cyber-bg/90", "shadow-lg");
      } else {
        header.classList.remove("bg-cyber-bg/90", "shadow-lg");
      }
    }
  });


  /* ==========================================
     10. Skills Animate On Scroll (Progress Bars)
     ========================================== */
  const skillItems = document.querySelectorAll(".skill-item");
  
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const targetPercent = item.getAttribute("data-target-progress");
        const bar = item.querySelector(".skill-progress-bar");
        
        if (bar) {
          bar.style.width = targetPercent + "%";
        }
        // Unobserve after animating once
        skillObserver.unobserve(item);
      }
    });
  }, { threshold: 0.1 });
  
  skillItems.forEach(si => skillObserver.observe(si));


  /* ==========================================
     11. Achievements Rolling Counts
     ========================================== */
  const countCards = document.querySelectorAll(".achievement-counter-card");
  
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const targetVal = parseInt(card.getAttribute("data-final-count"), 10);
        const textSpan = card.querySelector(".count-value");
        
        let curr = 0;
        const step = Math.ceil(targetVal / 50);
        const counterTimer = setInterval(() => {
          curr += step;
          if (curr >= targetVal) {
            curr = targetVal;
            clearInterval(counterTimer);
          }
          textSpan.innerText = curr;
        }, 30);
        
        countObserver.unobserve(card);
      }
    });
  }, { threshold: 0.3 });
  
  countCards.forEach(cc => countObserver.observe(cc));


  /* ==========================================
     12. Project Filtering Engine
     ========================================== */
  const filterBtns = document.querySelectorAll(".project-filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Toggle button styles
      filterBtns.forEach(b => {
        b.classList.remove("bg-cyber-blue", "text-cyber-bg");
        b.classList.add("bg-transparent", "text-cyber-muted", "border-gray-800");
      });
      btn.classList.add("bg-cyber-blue", "text-cyber-bg");
      btn.classList.remove("bg-transparent", "text-cyber-muted", "border-gray-800");
      
      const filterValue = btn.getAttribute("data-filter");
      
      projectCards.forEach(card => {
        const categories = card.getAttribute("data-categories").split(",");
        
        if (filterValue === "all" || categories.includes(filterValue)) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });


  /* ==========================================
     13. Dynamic GitHub Profile Integration API
     ========================================== */
  const ghUser = "saurabhbuilds59";
  
  async function fetchGitHubData() {
    try {
      const profileRes = await fetch(`https://api.github.com/users/${ghUser}`);
      if (!profileRes.ok) throw new Error("GitHub user not found");
      const profileData = await profileRes.json();
      
      // Update details
      document.getElementById("gh-profile-pic").src = profileData.avatar_url;
      document.getElementById("gh-profile-name").innerText = profileData.name || "Saurabh Sen";
      document.getElementById("gh-profile-bio").innerText = profileData.bio || "Full Stack Developer building neat products on open source technologies.";
      document.getElementById("gh-followers-count").innerText = profileData.followers;
      document.getElementById("gh-following-count").innerText = profileData.following;
      document.getElementById("gh-repos-count").innerText = profileData.public_repos;
      
      // Fetch latest repos
      const reposRes = await fetch(`https://api.github.com/users/${ghUser}/repos?sort=updated&per_page=4`);
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        renderRepositories(reposData);
      }
    } catch (err) {
      console.warn("GitHub API Limit reached or offline. Loading fallback profile stats:", err);
      // Fallback preloaded cards remain visible
      loadFallbackRepos();
    }
  }
  
  function renderRepositories(repos) {
    const grid = document.getElementById("github-latest-repos-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    if (repos.length === 0) {
      grid.innerHTML = `<p class="text-xs text-cyber-muted col-span-2">No public deployments cluster found.</p>`;
      return;
    }
    
    repos.forEach(repo => {
      const card = document.createElement("div");
      card.className = "p-5 bg-cyber-darker/60 border border-gray-800 rounded-xl hover:border-cyber-blue/30 transition-all duration-300 flex flex-col justify-between";
      
      // Select appropriate language indicator dot color
      let langColor = "bg-gray-400";
      if (repo.language === "JavaScript") langColor = "bg-yellow-400";
      else if (repo.language === "Python") langColor = "bg-blue-500";
      else if (repo.language === "TypeScript") langColor = "bg-blue-400";
      else if (repo.language === "HTML") langColor = "bg-orange-500";
      else if (repo.language === "CSS") langColor = "bg-purple-400";
      
      card.innerHTML = `
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <h5 class="text-xs font-bold text-white tracking-wide truncate max-w-[80%]">${repo.name}</h5>
            <span class="text-[9px] text-cyber-blue font-mono"><i class="far fa-star"></i> ${repo.stargazers_count}</span>
          </div>
          <p class="text-[11px] text-cyber-muted font-light leading-relaxed line-clamp-2">${repo.description || "Interactive full-stack node module."}</p>
        </div>
        <div class="flex justify-between items-center pt-4 border-t border-gray-900 mt-4 text-[10px] font-mono">
          <span class="flex items-center gap-1.5 text-cyber-muted">
            <span class="w-2 h-2 rounded-full ${langColor} block"></span> ${repo.language || "Other"}
          </span>
          <a href="${repo.html_url}" target="_blank" class="text-cyber-blue hover:underline uppercase tracking-widest text-[9px]">VIEW_SRC</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }
  
  function loadFallbackRepos() {
    const grid = document.getElementById("github-latest-repos-grid");
    if (!grid) return;
    
    const fallback = [
      {
        name: "luxury-restaurant-express",
        description: "Sophisticated booking application featuring beautiful responsive gallery and a validations reservation core.",
        language: "JavaScript",
        stargazers_count: 3,
        html_url: "https://github.com/saurabhbuilds59"
      },
      {
        name: "btech-ai-neural-net",
        description: "Curriculum projects utilizing custom algorithms, regression systems, and dataset regression graphs.",
        language: "Python",
        stargazers_count: 5,
        html_url: "https://github.com/saurabhbuilds59"
      },
      {
        name: "cosmo-eshop-react",
        description: "Dynamic responsive commerce setup featuring persistent shopping checkout and modular state patterns.",
        language: "TypeScript",
        stargazers_count: 2,
        html_url: "https://github.com/saurabhbuilds59"
      },
      {
        name: "portfolio-cyber-3d",
        description: "Source code of this modern portfolio website with glassmorphism overlays and custom particle constellation.",
        language: "HTML",
        stargazers_count: 4,
        html_url: "https://github.com/saurabhbuilds59"
      }
    ];
    renderRepositories(fallback);
  }
  
  fetchGitHubData();


  /* ==========================================
     14. GitHub Custom Heatmap Matrix Layout
     ========================================== */
  const heatmapContainer = document.getElementById("contribution-heatmap");
  if (heatmapContainer) {
    heatmapContainer.innerHTML = "";
    
    // Create ~110 visual days grid (last ~15 weeks)
    const numCells = window.innerWidth < 640 ? 70 : 126; // 10 columns vs 18 columns
    for (let i = 0; i < numCells; i++) {
      const cell = document.createElement("div");
      cell.className = "contrib-cell";
      
      // Random activity level (0: none, 1: low, 2: mid, 3: active)
      const level = Math.floor(Math.random() * 4);
      
      if (level === 0) {
        cell.classList.add("bg-gray-900/40", "border", "border-gray-900");
      } else if (level === 1) {
        cell.classList.add("bg-cyber-purple/20");
      } else if (level === 2) {
        cell.classList.add("bg-cyber-purple/50");
      } else {
        cell.classList.add("bg-cyber-purple", "animate-pulse");
      }
      
      // Custom hover tooltip info
      const randomContribCount = level * Math.floor(Math.random() * 4 + 1);
      cell.setAttribute("title", `${randomContribCount} contributions on cluster node`);
      
      heatmapContainer.appendChild(cell);
    }
  }


  /* ==========================================
     15. LinkedIn Skill Endorsement Interactive Game
     ========================================== */
  const endorseTags = document.querySelectorAll(".endorse-tag");
  const multiplierSpan = document.getElementById("endorse-multiplier");
  
  let endorseStreak = 1;
  
  endorseTags.forEach(tag => {
    tag.addEventListener("click", () => {
      if (tag.classList.contains("active")) {
        // Decrement on toggle off
        tag.classList.remove("active", "border-cyber-blue", "text-cyber-blue");
        const badge = tag.querySelector(".badge");
        const currentCount = parseInt(badge.innerText.replace("+", ""), 10);
        badge.innerText = `+${currentCount - 1}`;
        
        endorseStreak = Math.max(1, endorseStreak - 1);
      } else {
        // Increment and animate on toggle on
        tag.classList.add("active");
        const badge = tag.querySelector(".badge");
        const currentCount = parseInt(badge.innerText.replace("+", ""), 10);
        badge.innerText = `+${currentCount + endorseStreak}`;
        
        // Add fancy neon visual ring
        tag.classList.add("scale-110", "shadow-neon-blue");
        setTimeout(() => tag.classList.remove("scale-110", "shadow-neon-blue"), 300);
        
        // Boost endorsement streak
        endorseStreak++;
      }
      
      if (multiplierSpan) {
        multiplierSpan.innerText = `STREAK: ${endorseStreak}X ${endorseStreak > 1 ? '🔥' : ''}`;
      }
    });
  });


  /* ==========================================
     16. Interactive Project Live Emulator Modal
     ========================================== */
  const emulatorModal = document.getElementById("emulator-modal");
  const closeEmulatorBtn = document.getElementById("close-emulator-btn");
  const emulatorTitle = document.getElementById("emulator-title");
  const emulatorUrl = document.getElementById("emulator-url");
  const emulatorContent = document.getElementById("emulator-content");
  
  const triggers = document.querySelectorAll(".live-emulator-trigger-btn");
  
  triggers.forEach(trig => {
    trig.addEventListener("click", () => {
      const proj = trig.getAttribute("data-project");
      openEmulator(proj);
    });
  });
  
  if (closeEmulatorBtn) {
    closeEmulatorBtn.addEventListener("click", () => {
      emulatorModal.classList.add("opacity-0", "pointer-events-none");
      emulatorModal.querySelector(".w-full").classList.add("translate-y-8");
    });
  }
  
  function openEmulator(projectName) {
    // Reveal Modal
    emulatorModal.classList.remove("opacity-0", "pointer-events-none");
    emulatorModal.querySelector(".w-full").classList.remove("translate-y-8");
    
    // Set parameters
    if (projectName === "restaurant") {
      emulatorTitle.innerText = "L'ÉTOILE_DORÉE_SERVER_SIMULATOR";
      emulatorUrl.innerText = "https://saurabhsen.dev/projects/luxury-restaurant";
      injectRestaurantSimulator();
    } else if (projectName === "portfolio") {
      emulatorTitle.innerText = "CYBER_SHELL_EMULATOR_v2.0";
      emulatorUrl.innerText = "https://saurabhsen.dev/projects/terminal-portfolio";
      injectPortfolioTerminal();
    } else if (projectName === "business") {
      emulatorTitle.innerText = "AERO_CORP_DASHBOARD_SIM";
      emulatorUrl.innerText = "https://saurabhsen.dev/projects/business-solutions";
      injectBusinessSimulator();
    } else if (projectName === "ecommerce") {
      emulatorTitle.innerText = "COSMO_SHOP_CHECKOUT_GATEWAY";
      emulatorUrl.innerText = "https://saurabhsen.dev/projects/cosmo-ecommerce";
      injectEcommerceSimulator();
    }
  }
  
  /* Emulator Injection Helpers */
  function injectRestaurantSimulator() {
    emulatorContent.innerHTML = `
      <div class="w-full max-w-md bg-gray-950 p-6 rounded-xl border border-cyber-blue/30 space-y-4 text-left font-mono text-xs">
        <h4 class="text-cyber-blue font-cyber font-bold uppercase text-center border-b border-gray-800 pb-2">Seating Booking Uplink</h4>
        <div class="space-y-2">
          <p class="text-cyber-muted">> SIMULATING RESERVATION DATABASE STATUS...</p>
          <div class="p-3 bg-gray-900 rounded border border-gray-800 space-y-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-white">Active bookings:</span>
              <span class="text-cyber-blue">24 / 30 tables</span>
            </div>
            <div class="flex justify-between text-[11px]">
              <span class="text-white">Seating rate:</span>
              <span class="text-emerald-400">80% occupied</span>
            </div>
          </div>
          
          <label class="block text-[10px] text-cyber-muted uppercase mt-3">Mock Quick Seat Request</label>
          <div class="flex gap-2">
            <input type="text" id="sim-rest-name" value="Saurabh Sen" class="flex-1 bg-gray-900 border border-gray-800 px-3 py-1.5 text-white rounded text-xs focus:outline-none focus:border-cyber-blue">
            <select id="sim-rest-guests" class="bg-gray-900 border border-gray-800 px-3 py-1.5 text-white rounded text-xs focus:outline-none">
              <option value="2">2 guests</option>
              <option value="4">4 guests</option>
              <option value="6">6 guests</option>
            </select>
          </div>
          
          <button id="sim-book-btn" class="w-full py-2 bg-cyber-blue text-cyber-bg font-bold rounded hover:bg-cyber-blueDark uppercase tracking-wider text-[10px] tracking-widest font-cyber transition-all">Submit Seat Request</button>
          
          <div id="sim-rest-output" class="hidden text-[11px] p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"></div>
        </div>
      </div>
    `;
    
    document.getElementById("sim-book-btn").addEventListener("click", () => {
      const name = document.getElementById("sim-rest-name").value;
      const guests = document.getElementById("sim-rest-guests").value;
      const output = document.getElementById("sim-rest-output");
      
      output.classList.remove("hidden");
      output.innerHTML = `> SUBMITTED TO EXPRESS PORT: 3000...<br>> SUCCESS: Table for <strong>${guests}</strong> guests allocated to <strong>${name}</strong> under ID: <strong>RES-${Math.random().toString(36).substr(2, 5).toUpperCase()}</strong>!`;
    });
  }
  
  function injectPortfolioTerminal() {
    emulatorContent.innerHTML = `
      <div class="w-full max-w-lg bg-black/90 p-5 rounded-xl border border-cyber-purple/30 text-left font-mono text-xs space-y-4">
        <div class="flex justify-between border-b border-gray-900 pb-2 text-[10px] text-cyber-muted">
          <span>PORTFOLIO_SYSTEM_SHELL_v2.0</span>
          <span>UPTIME: 100%</span>
        </div>
        
        <div id="term-log" class="space-y-1.5 h-48 overflow-y-auto scrollbar-thin text-cyber-lightText">
          <div>Saurabh Sen Kernel loaded successfully.</div>
          <div>Type <span class="text-cyber-purple font-bold">help</span> to view available operations terminal.</div>
        </div>
        
        <div class="flex items-center gap-2 border-t border-gray-900 pt-2.5">
          <span class="text-cyber-purple font-bold">saurabhsen@developer:~$</span>
          <input type="text" id="term-input" class="flex-1 bg-transparent text-white focus:outline-none" autofocus autocomplete="off">
        </div>
      </div>
    `;
    
    const termInput = document.getElementById("term-input");
    const termLog = document.getElementById("term-log");
    
    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = termInput.value.trim().toLowerCase();
        termInput.value = "";
        
        const line = document.createElement("div");
        line.innerHTML = `<span class="text-cyber-muted">$ ${val}</span>`;
        termLog.appendChild(line);
        
        const responseLine = document.createElement("div");
        if (val === "help") {
          responseLine.innerHTML = `<span class="text-cyber-purple">Available Shell commands:</span><br>
            - <span class="text-cyber-blue">skills</span>: Print technical matrix stack details.<br>
            - <span class="text-cyber-blue">neofetch</span>: Display developer profile specs.<br>
            - <span class="text-cyber-blue">matrix</span>: Load cognitive animation sequence.<br>
            - <span class="text-cyber-blue">clear</span>: Clear console history.`;
        } else if (val === "skills") {
          responseLine.innerHTML = `<span class="text-emerald-400">FRONTEND:</span> React, Next, Tailwind CSS, Bootstrap, JS<br>
            <span class="text-emerald-400">BACKEND:</span> Node, Express, Django REST, Python<br>
            <span class="text-emerald-400">DATABASE:</span> MongoDB, Postgres, MySQL, Firebase Admin`;
        } else if (val === "neofetch") {
          responseLine.innerHTML = `<span class="text-cyber-blue">saurabhsen@developer</span><br>
            ----------------------<br>
            OS: Saurabh Sen Dev Kernel v1.5<br>
            Education: B.Tech Artificial Intelligence & Data Science<br>
            Academy: Shri Ram Institute of Technology (2024-2028)<br>
            Host: Jabalpur, Madhya Pradesh, India<br>
            Shell: Bash / Javascript ES6`;
        } else if (val === "matrix") {
          responseLine.innerHTML = `<span class="text-emerald-500 font-bold animate-pulse">LOADING COGNITIVE STREAM: [||||||||||||||||||||] 100% SUCCESS.</span>`;
        } else if (val === "clear") {
          termLog.innerHTML = "";
          return;
        } else if (val === "") {
          return;
        } else {
          responseLine.innerHTML = `<span class="text-red-400">Command not found: "${val}". Type "help" for instructions.</span>`;
        }
        
        termLog.appendChild(responseLine);
        termLog.scrollTop = termLog.scrollHeight;
      }
    });
  }
  
  function injectBusinessSimulator() {
    emulatorContent.innerHTML = `
      <div class="w-full max-w-lg bg-gray-900 p-5 rounded-xl border border-cyber-blue/30 text-left font-mono text-xs space-y-4">
        <h4 class="text-white font-cyber font-bold uppercase border-b border-gray-800 pb-2 flex justify-between items-center">
          <span>Sales & Analytics Dashboard</span>
          <span class="text-[10px] text-cyber-blue font-bold">MOCK DATA</span>
        </h4>
        
        <div class="grid grid-cols-3 gap-3">
          <div class="p-3 bg-gray-950 rounded border border-gray-800 text-center">
            <div class="text-[10px] text-cyber-muted uppercase">Conversions</div>
            <div class="text-base text-cyber-blue font-bold mt-1">45,820</div>
          </div>
          <div class="p-3 bg-gray-950 rounded border border-gray-800 text-center">
            <div class="text-[10px] text-cyber-muted uppercase">Retention</div>
            <div class="text-base text-emerald-400 font-bold mt-1">94.8%</div>
          </div>
          <div class="p-3 bg-gray-950 rounded border border-gray-800 text-center">
            <div class="text-[10px] text-cyber-muted uppercase">Server load</div>
            <div class="text-base text-cyber-purple font-bold mt-1">12.5%</div>
          </div>
        </div>

        <div class="p-4 bg-gray-950 rounded border border-gray-800 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-white uppercase">Client Load Balancing</span>
            <button id="sim-dash-recalc" class="px-3 py-1 bg-cyber-blue hover:bg-cyber-blueDark text-cyber-bg text-[10px] font-bold rounded">REFRESH</button>
          </div>
          <div class="w-full h-12 bg-gray-900 relative rounded overflow-hidden flex items-end">
            <!-- Simulated bar charts -->
            <div class="w-[12%] bg-cyber-blue h-[45%] mx-auto transition-all duration-300 sim-bar"></div>
            <div class="w-[12%] bg-cyber-purple h-[75%] mx-auto transition-all duration-300 sim-bar"></div>
            <div class="w-[12%] bg-cyber-blue h-[60%] mx-auto transition-all duration-300 sim-bar"></div>
            <div class="w-[12%] bg-cyber-purple h-[90%] mx-auto transition-all duration-300 sim-bar"></div>
            <div class="w-[12%] bg-cyber-blue h-[30%] mx-auto transition-all duration-300 sim-bar"></div>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById("sim-dash-recalc").addEventListener("click", () => {
      const bars = document.querySelectorAll(".sim-bar");
      bars.forEach(bar => {
        const randH = Math.floor(Math.random() * 80) + 15;
        bar.style.height = randH + "%";
      });
    });
  }
  
  function injectEcommerceSimulator() {
    emulatorContent.innerHTML = `
      <div class="w-full max-w-sm bg-gray-950 p-6 rounded-xl border border-cyber-purple/30 text-left font-mono text-xs space-y-4">
        <h4 class="text-cyber-purple font-cyber font-bold uppercase text-center border-b border-gray-800 pb-2">Cosmo Checkout Simulation</h4>
        
        <div class="space-y-2">
          <div class="flex justify-between items-center p-2.5 bg-gray-900 border border-gray-800 rounded">
            <div>
              <div class="font-bold text-white">Quantum Dev Mug</div>
              <div class="text-[9px] text-cyber-muted">$24.99 x 1 qty</div>
            </div>
            <span class="text-cyber-purple font-bold">$24.99</span>
          </div>
          <div class="flex justify-between items-center p-2.5 bg-gray-900 border border-gray-800 rounded">
            <div>
              <div class="font-bold text-white">Neural Keycap Set</div>
              <div class="text-[9px] text-cyber-muted">$89.99 x 1 qty</div>
            </div>
            <span class="text-cyber-purple font-bold">$89.99</span>
          </div>
          
          <div class="flex justify-between text-xs pt-2 font-bold text-white border-t border-gray-800">
            <span>TOTAL COST:</span>
            <span class="text-cyber-purple font-cyber">$114.98</span>
          </div>
          
          <button id="sim-checkout-btn" class="w-full mt-4 py-2.5 bg-cyber-purple hover:bg-cyber-purpleDark text-white font-bold rounded uppercase tracking-wider text-[10px] tracking-widest font-cyber transition-all">Authenticate Checkout</button>
          
          <div id="sim-checkout-output" class="hidden text-[11px] p-2.5 rounded bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue"></div>
        </div>
      </div>
    `;
    
    document.getElementById("sim-checkout-btn").addEventListener("click", () => {
      const output = document.getElementById("sim-checkout-output");
      output.classList.remove("hidden");
      output.innerHTML = `> MOCK PAYMENT RECEIVED SECURELY...<br>> GENERATING CART RECEIPT BLOCK...<br>> SUCCESS: Order logged under transaction hash <strong>0x7F2A...${Math.floor(Math.random()*9000+1000)}</strong>!`;
    });
  }


  /* ==========================================
     17. Dynamic AI Bot Chat Client Integration
     ========================================== */
  const aiChatToggle = document.getElementById("ai-chat-toggle");
  const aiChatPanel = document.getElementById("ai-chat-panel");
  const aiChatClose = document.getElementById("ai-chat-close");
  const aiChatForm = document.getElementById("ai-chat-form");
  const aiChatInput = document.getElementById("ai-chat-input");
  const aiChatMessages = document.getElementById("ai-chat-messages");
  
  let chatHistory = [];
  
  if (aiChatToggle && aiChatPanel) {
    aiChatToggle.addEventListener("click", () => {
      const isHidden = aiChatPanel.classList.contains("opacity-0");
      if (isHidden) {
        aiChatPanel.classList.remove("opacity-0", "pointer-events-none", "translate-y-12");
        aiChatPanel.classList.add("opacity-100", "translate-y-0");
        aiChatInput.focus();
      } else {
        aiChatPanel.classList.remove("opacity-100", "translate-y-0");
        aiChatPanel.classList.add("opacity-0", "pointer-events-none", "translate-y-12");
      }
    });
    
    if (aiChatClose) {
      aiChatClose.addEventListener("click", () => {
        aiChatPanel.classList.remove("opacity-100", "translate-y-0");
        aiChatPanel.classList.add("opacity-0", "pointer-events-none", "translate-y-12");
      });
    }
  }
  
  if (aiChatForm) {
    aiChatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userText = aiChatInput.value.trim();
      if (!userText) return;
      
      aiChatInput.value = "";
      
      // Append user bubble
      appendMessage("user", userText);
      
      // Add typing indicator bubble
      const typingBubble = appendTypingIndicator();
      
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userText,
            history: chatHistory
          })
        });
        
        // Remove typing indicator
        typingBubble.remove();
        
        if (response.ok) {
          const data = await response.json();
          appendMessage("bot", data.response);
          
          // Save parameters in history array
          chatHistory.push({ role: "user", text: userText });
          chatHistory.push({ role: "model", text: data.response });
          // Cap history array size
          if (chatHistory.length > 10) chatHistory.splice(0, 2);
        } else {
          throw new Error("Chat server error");
        }
      } catch (err) {
        typingBubble.remove();
        console.error("AI Chat Error:", err);
        appendMessage("bot", "My cyber communications node is experiencing transient connection delays. Please contact me directly at **saurabhsen937@gmail.com**!");
      }
    });
  }
  
  function appendMessage(sender, text) {
    const bubble = document.createElement("div");
    bubble.className = "flex gap-2.5 items-start";
    
    if (sender === "user") {
      bubble.classList.add("justify-end");
      bubble.innerHTML = `
        <div class="p-3 bg-gradient-to-tr from-cyber-blue to-cyber-blue/80 text-cyber-bg font-bold rounded-2xl rounded-tr-none max-w-[85%]">
          ${text}
        </div>
      `;
    } else {
      bubble.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue text-xs shrink-0">
          <i class="fas fa-robot"></i>
        </div>
        <div class="p-3 bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-none max-w-[85%] text-cyber-lightText text-xs leading-relaxed font-light">
          ${text}
        </div>
      `;
    }
    
    aiChatMessages.appendChild(bubble);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }
  
  function appendTypingIndicator() {
    const bubble = document.createElement("div");
    bubble.className = "flex gap-2.5 items-start";
    bubble.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue text-xs shrink-0">
        <i class="fas fa-robot"></i>
      </div>
      <div class="p-3 bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-none text-cyber-blue text-xs flex gap-1 items-center">
        <span class="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce" style="animation-delay: 0ms"></span>
        <span class="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce" style="animation-delay: 150ms"></span>
        <span class="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-bounce" style="animation-delay: 300ms"></span>
      </div>
    `;
    aiChatMessages.appendChild(bubble);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    return bubble;
  }


  /* ==========================================
     18. Resume Modal View Controls
     ========================================== */
  const resumeModal = document.getElementById("resume-modal");
  const openResumeBtn = document.getElementById("open-resume-modal-btn");
  const closeResumeBtn = document.getElementById("close-resume-btn");
  const downloadPdfBtn = document.getElementById("download-pdf-btn");
  
  if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener("click", () => {
      resumeModal.classList.remove("opacity-0", "pointer-events-none");
      resumeModal.querySelector(".w-full").classList.remove("translate-y-8");
    });
    
    if (closeResumeBtn) {
      closeResumeBtn.addEventListener("click", () => {
        resumeModal.classList.add("opacity-0", "pointer-events-none");
        resumeModal.querySelector(".w-full").classList.add("translate-y-8");
      });
    }
  }
  
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", () => {
      window.print(); // Triggers high quality CSS print media styling of the resume sheet!
    });
  }


  /* ==========================================
     19. Contact Form API Gateway Uplink
     ========================================== */
  const contactForm = document.getElementById("portfolio-contact-form");
  const contactSubmitBtn = document.getElementById("contact-form-submit-btn");
  const formNotification = document.getElementById("form-notification-area");
  
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // Update submitting state button
      contactSubmitBtn.innerText = "TRANSMITTING_PAYLOAD...";
      contactSubmitBtn.disabled = true;
      formNotification.classList.add("hidden");
      
      const formData = {
        name: document.getElementById("contact-name").value,
        email: document.getElementById("contact-email").value,
        subject: document.getElementById("contact-subject").value,
        message: document.getElementById("contact-message").value
      };
      
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          // Clear form and display success alert
          contactForm.reset();
          
          formNotification.className = "text-xs font-mono p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 block";
          formNotification.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}<br><span class="text-[10px] text-cyber-muted uppercase">TRANSMIT ID: ${data.messageId}</span>`;
        } else {
          throw new Error(data.error || "Uplink validation failed");
        }
      } catch (err) {
        console.error("Contact Form Failure:", err);
        formNotification.className = "text-xs font-mono p-3 rounded-lg border bg-red-500/10 border-red-500/30 text-red-400 block";
        formNotification.innerHTML = `<i class="fas fa-exclamation-triangle"></i> UPLINK_ERROR: ${err.message || "Failed to route message packets."}`;
      } finally {
        contactSubmitBtn.innerText = "TRANSMIT_PAYLOAD";
        contactSubmitBtn.disabled = false;
      }
    });
  }


  /* ==========================================
     20. Back to top link trigger
     ========================================== */
  const bttBtn = document.getElementById("footer-back-to-top");
  if (bttBtn) {
    bttBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

});

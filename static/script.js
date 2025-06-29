function confirmDelete() {
    return confirm("Are you sure?you want to delete this task?");
}
function confirmEdit() {
    return confirm("Are you sure about editing the task?")
}
function confirmDone() {
    return confirm("is really the task completed?")
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  });
  
console.log("Loaded successfully");

// Auto-hide flash messages after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const flashMessages = document.querySelectorAll('.flash-message');
    
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    });
});

// Smooth scroll to top when clicking on navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation to forms
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            submitBtn.disabled = true;
            
            // Re-enable after a delay (in case of errors)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    });
});

// Add hover effects to task items
document.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add confirmation for delete actions
document.querySelectorAll('a[href*="delete"]').forEach(link => {
    link.addEventListener('click', function(e) {
        if (!confirm('Are you sure you want to delete this item?')) {
            e.preventDefault();
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit forms
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeForm = document.querySelector('form:focus-within');
        if (activeForm) {
            const submitBtn = activeForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }
    
    // Escape key to cancel edit mode
    if (e.key === 'Escape') {
        const editForm = document.querySelector('.edit-form');
        if (editForm) {
            const cancelBtn = editForm.querySelector('a[href*="home"]');
            if (cancelBtn) {
                cancelBtn.click();
            }
        }
    }
});

// Add smooth animations for task completion
document.querySelectorAll('.checkbox-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const taskItem = this.closest('.task-item');
        if (taskItem) {
            taskItem.style.transition = 'all 0.3s ease';
        }
    });
});

// Add focus management for better accessibility
document.querySelectorAll('input[type="text"], input[type="password"]').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Add loading states for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.disabled) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        }
    });
});

// Add smooth page transitions
window.addEventListener('pageshow', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add responsive menu toggle for mobile
const navMenu = document.querySelector('.nav-menu');
const navBrand = document.querySelector('.nav-brand');

if (navMenu && navBrand) {
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.style.display = 'none';
    
    navBrand.appendChild(mobileMenuBtn);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Hide mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Responsive behavior
    function checkMobile() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
            navMenu.classList.add('mobile');
        } else {
            mobileMenuBtn.style.display = 'none';
            navMenu.classList.remove('mobile', 'active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
}

// Add CSS for mobile menu
const mobileStyles = `
    @media (max-width: 768px) {
        .nav-menu.mobile {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.mobile.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .mobile-menu-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #667eea;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        
        .mobile-menu-btn:hover {
            background: rgba(102, 126, 234, 0.1);
        }
    }
`;

// Inject mobile styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileStyles;
document.head.appendChild(styleSheet);

// Theme toggle logic
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        document.querySelector('#theme-toggle i').className = 'fas fa-sun';
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        document.querySelector('#theme-toggle i').className = 'fas fa-moon';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        themeBtn.addEventListener('click', function() {
            setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
        });
    }
});
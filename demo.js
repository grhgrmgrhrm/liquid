const MOBILE_BREAKPOINT = 768
let navMenuContainerInstance = null
let navLinksWrapper = null

// Navigation Menu Items
const menuItems = [
  { text: 'Home', onClick: () => console.log('Home clicked') },
  { text: 'About', onClick: () => console.log('About clicked') },
  { text: 'Services', onClick: () => console.log('Services clicked') },
  { text: 'Contact', onClick: () => console.log('Contact clicked') }
]

const mobileMenuToggleButton = document.getElementById('mobile-menu-toggle')

// Initialize Navigation Menu
function initNavigationMenu() {
  const navContainer = document.querySelector('#nav-container')
  if (!navContainer) return

  const isMobileView = window.innerWidth <= MOBILE_BREAKPOINT

  const navMenuContainer = new Container({
    borderRadius: isMobileView ? 2 : 32,
    type: isMobileView ? 'rounded' : 'pill',
    tintOpacity: isMobileView ? 0.25 : 0.15
  })
  navMenuContainerInstance = navMenuContainer

  const brandButton = new Button({
    text: 'Liquid Demo',
    size: 18,
    type: 'pill',
    tintOpacity: 0.35,
    onClick: () => console.log('Liquid Demo brand clicked')
  })
  brandButton.element.classList.add('brand-button')
  navMenuContainer.addChild(brandButton)

  navLinksWrapper = document.createElement('div')
  navLinksWrapper.className = 'nav-links'
  navMenuContainer.element.appendChild(navLinksWrapper)

  // Create menu items as text links (not buttons)
  menuItems.forEach(item => {
    const menuLink = document.createElement('a')
    menuLink.href = '#'
    menuLink.textContent = item.text
    menuLink.className = 'nav-link nav-item'
    menuLink.addEventListener('click', (e) => {
      e.preventDefault()
      item.onClick()
    })
    navLinksWrapper.appendChild(menuLink)
  })

  if (mobileMenuToggleButton) {
    navMenuContainer.element.appendChild(mobileMenuToggleButton)
  }

  applyNavModeClasses(isMobileView)

  navContainer.appendChild(navMenuContainer.element)
}

// Initialize Mobile Navigation Menu
function initMobileNavigationMenu() {
  const mobileNavContainer = document.querySelector('#mobile-nav-container')
  if (!mobileNavContainer) return

  const mobileMenuContainer = new Container({
    borderRadius: 0,
    type: 'rounded',
    tintOpacity: 0.25
  })

  const mobileBrandButton = new Button({
    text: 'Liquid Demo',
    size: 22,
    type: 'pill',
    tintOpacity: 0.35,
    onClick: () => console.log('Liquid Demo brand clicked (mobile)')
  })
  mobileBrandButton.element.classList.add('brand-button')
  mobileMenuContainer.addChild(mobileBrandButton)

  // Create mobile menu items as text links
  menuItems.forEach(item => {
    const mobileMenuLink = document.createElement('a')
    mobileMenuLink.href = '#'
    mobileMenuLink.textContent = item.text
    mobileMenuLink.className = 'mobile-nav-link'
    mobileMenuLink.addEventListener('click', (e) => {
      e.preventDefault()
      item.onClick()
      closeMobileMenu()
    })
    mobileMenuContainer.element.appendChild(mobileMenuLink)
  })

  // Create mobile Login button (keep as button)
  const mobileLoginButton = new Button({
    text: 'Login',
    size: 20,
    type: 'pill',
    tintOpacity: 0.3,
    onClick: () => {
      console.log('Login clicked')
      closeMobileMenu()
    }
  })

  mobileMenuContainer.addChild(mobileLoginButton)
  mobileNavContainer.appendChild(mobileMenuContainer.element)
}

// Initialize menus when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initNavigationMenu()
    initMobileNavigationMenu()
    setupNavResizeListener()
  })
} else {
  initNavigationMenu()
  initMobileNavigationMenu()
  setupNavResizeListener()
}

function setupNavResizeListener() {
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const shouldBeMobile = window.innerWidth <= MOBILE_BREAKPOINT
      const desiredRadius = shouldBeMobile ? 5 : 32
      const desiredType = shouldBeMobile ? 'rounded' : 'pill'
      if (navMenuContainerInstance) {
        applyNavModeClasses(shouldBeMobile)

        if (navMenuContainerInstance.type !== desiredType) {
          const el = navMenuContainerInstance.element
          if (el) {
            el.classList.remove('glass-container-circle', 'glass-container-pill')
            if (desiredType === 'pill') {
              el.classList.add('glass-container-pill')
            } else if (desiredType === 'circle') {
              el.classList.add('glass-container-circle')
            }
          }
          navMenuContainerInstance.type = desiredType
          navMenuContainerInstance.updateSizeFromDOM()
        }
        if (navMenuContainerInstance.borderRadius !== desiredRadius) {
          navMenuContainerInstance.borderRadius = desiredRadius
          if (navMenuContainerInstance.element) {
            navMenuContainerInstance.element.style.borderRadius = desiredRadius + 'px'
          }
          if (navMenuContainerInstance.canvas) {
            navMenuContainerInstance.canvas.style.borderRadius = desiredRadius + 'px'
          }
          if (navMenuContainerInstance.gl_refs?.borderRadiusLoc && navMenuContainerInstance.gl_refs?.gl) {
            navMenuContainerInstance.gl_refs.gl.uniform1f(
              navMenuContainerInstance.gl_refs.borderRadiusLoc,
              desiredRadius
            )
          }
        }
      }
    }, 150)
  })
}


// Mobile Menu Toggle Functionality
const mobileSidebar = document.getElementById('mobile-sidebar')
const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay')

function openMobileMenu() {
  mobileSidebar.classList.add('active')
  mobileSidebarOverlay.classList.add('active')
  mobileMenuToggleButton?.classList.add('active')
  document.body.style.overflow = 'hidden'
}

function closeMobileMenu() {
  mobileSidebar.classList.remove('active')
  mobileSidebarOverlay.classList.remove('active')
  mobileMenuToggleButton?.classList.remove('active')
  document.body.style.overflow = ''
}

if (mobileMenuToggleButton) {
  mobileMenuToggleButton.addEventListener('click', () => {
    if (mobileSidebar.classList.contains('active')) {
      closeMobileMenu()
    } else {
      openMobileMenu()
    }
  })
}

function applyNavModeClasses(isMobile) {
  if (!navMenuContainerInstance?.element) return
  const el = navMenuContainerInstance.element
  el.classList.toggle('nav-menu-mobile', isMobile)
  el.classList.toggle('nav-menu-desktop', !isMobile)

  if (navLinksWrapper) {
    navLinksWrapper.style.display = isMobile ? 'none' : 'flex'
  }
}

if (mobileSidebarOverlay) {
  mobileSidebarOverlay.addEventListener('click', closeMobileMenu)
}

// Close mobile menu on window resize if it becomes desktop size
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && mobileSidebar.classList.contains('active')) {
    closeMobileMenu()
  }
})

// Handle window resize - recapture page snapshot and update all glass instances
let resizeTimeout
window.addEventListener('resize', () => {
  // Debounce resize events to avoid excessive recapturing
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    console.log('Window resized, recapturing page snapshot...')

    // Reset snapshot state
    Container.pageSnapshot = null
    Container.isCapturing = true
    Container.waitingForSnapshot = Container.instances.slice() // All instances need update

    // Recapture page snapshot
    html2canvas(document.body, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      ignoreElements: function (element) {
        // Ignore all glass elements
        return (
          element.classList.contains('glass-container') ||
          element.classList.contains('glass-button') ||
          element.classList.contains('glass-button-text')
        )
      }
    })
      .then(snapshot => {
        console.log('Page snapshot recaptured after resize')
        Container.pageSnapshot = snapshot
        Container.isCapturing = false

        // Create new image and update all glass instances
        const img = new Image()
        img.src = snapshot.toDataURL()
        img.onload = () => {
          Container.instances.forEach(instance => {
            if (instance.gl_refs && instance.gl_refs.gl) {
              // Check if this is a nested glass button
              if (instance instanceof Button && instance.parent && instance.isNestedGlass) {
                // For nested glass buttons, reinitialize their texture to match parent's new size
                const gl = instance.gl_refs.gl
                const containerCanvas = instance.parent.canvas

                // Resize the button's texture to match new container canvas size
                gl.bindTexture(gl.TEXTURE_2D, instance.gl_refs.texture)
                gl.texImage2D(
                  gl.TEXTURE_2D,
                  0,
                  gl.RGBA,
                  containerCanvas.width,
                  containerCanvas.height,
                  0,
                  gl.RGBA,
                  gl.UNSIGNED_BYTE,
                  null
                )

                // Update texture size uniform to new container dimensions
                gl.uniform2f(instance.gl_refs.textureSizeLoc, containerCanvas.width, containerCanvas.height)

                // Update container size uniform for sampling calculations
                if (instance.gl_refs.containerSizeLoc) {
                  gl.uniform2f(instance.gl_refs.containerSizeLoc, instance.parent.width, instance.parent.height)
                }

                console.log(`Updated nested button texture: ${containerCanvas.width}x${containerCanvas.height}`)
              } else {
                // For standalone glass elements, update with new page snapshot
                const gl = instance.gl_refs.gl
                gl.bindTexture(gl.TEXTURE_2D, instance.gl_refs.texture)
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

                // Update texture size uniform
                gl.uniform2f(instance.gl_refs.textureSizeLoc, img.width, img.height)
              }

              // Force re-render for all instances
              if (instance.render) {
                instance.render()
              }
            }
          })
        }

        // Clear waiting queue
        Container.waitingForSnapshot = []
      })
      .catch(error => {
        console.error('html2canvas error on resize:', error)
        Container.isCapturing = false
        Container.waitingForSnapshot = []
      })
  }, 300) // 300ms debounce delay
})

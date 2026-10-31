'use strict';

const elementToggleFunc = (element) => element.classList.toggle('active');

const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));
}

const projectItems = [...document.querySelectorAll('[data-filter-item]')];
const filterButtons = [...document.querySelectorAll('[data-filter-btn]')];
const filterSelect = document.querySelector('[data-select]');
const filterSelectValue = document.querySelector('[data-selecct-value]');
const selectItems = [...document.querySelectorAll('[data-select-item]')];

const normalizeCategory = (value) => value.trim().toLocaleLowerCase('en');

const filterProjects = (selectedCategory) => {
  const category = normalizeCategory(selectedCategory);

  projectItems.forEach((project) => {
    const isVisible = category === 'all' || project.dataset.category.split('|').some((projectCategory) => normalizeCategory(projectCategory) === category);
    project.classList.toggle('active', isVisible);
  });

  filterButtons.forEach((button) => {
    button.classList.toggle('active', normalizeCategory(button.textContent) === category);
  });

  if (filterSelectValue) {
    const selectedButton = selectItems.find((item) => normalizeCategory(item.textContent) === category);
    filterSelectValue.textContent = selectedButton ? selectedButton.textContent.trim() : 'Select category';
  }
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => filterProjects(button.textContent));
});

if (filterSelect) {
  filterSelect.addEventListener('click', () => elementToggleFunc(filterSelect));
}

selectItems.forEach((item) => {
  item.addEventListener('click', () => {
    filterProjects(item.textContent);
    if (filterSelect) filterSelect.classList.remove('active');
  });
});

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');
if (form && formBtn) {
  formInputs.forEach((input) => {
    input.addEventListener('input', () => {
      formBtn.toggleAttribute('disabled', !form.checkValidity());
    });
  });
}

const navigationLinks = [...document.querySelectorAll('[data-nav-link]')];
const pages = [...document.querySelectorAll('[data-page]')];
navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const targetPage = normalizeCategory(link.textContent);

    pages.forEach((page) => {
      page.classList.toggle('active', normalizeCategory(page.dataset.page) === targetPage);
    });
    navigationLinks.forEach((navLink) => {
      navLink.classList.toggle('active', navLink === link);
    });
    window.scrollTo(0, 0);
  });
});

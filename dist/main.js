/// <reference lib="dom" />
const siteNameInput = document.getElementById('bookmarkName');
const siteURLInput = document.getElementById('bookmarkURL');
const submitButton = document.getElementById('submitBtn');
const tableContent = document.getElementById('tableContent');
const emptyState = document.getElementById('emptyState');
const tableResponsive = document.querySelector('.table-responsive');
const errorModalElement = document.getElementById('errorModal');
const errorModal = errorModalElement
    ? new bootstrap.Modal(errorModalElement)
    : null;
let bookmarks = [];
const nameRegex = /^[a-zA-Z0-9\s]{3,30}$/;
const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
document.addEventListener('DOMContentLoaded', function () {
    siteNameInput.focus();
    if (localStorage.getItem('bookmarksList')) {
        const storedBookmarks = localStorage.getItem('bookmarksList');
        if (storedBookmarks) {
            bookmarks = JSON.parse(storedBookmarks);
            renderBookmarks();
        }
    }
    updateEmptyState();
});
function renderBookmarks() {
    tableContent.innerHTML = '';
    bookmarks.forEach((bookmark, index) => {
        const validURL = /^https?:\/\//g.test(bookmark.siteURL)
            ? bookmark.siteURL
            : `https://${bookmark.siteURL}`;
        const fixedURL = validURL.replace(/^https?:\/\//g, '');
        const newBookmark = `
      <tr>
        <td>${index + 1}</td>
        <td>${bookmark.siteName}</td>
        <td>${fixedURL}</td>
        <td>
          <div class="d-flex flex-column flex-md-row justify-content-center align-items-center justify-content-lg-start gap-2">
            <button class="btn btn-visit me-2 d-flex flex-row align-items-center" data-index="${index}">
              <i class="fas fa-eye me-1"></i>Visit
            </button>
            <button class="btn btn-delete d-flex flex-row align-items-center" data-index="${index}">
              <i class="fas fa-trash-alt me-1"></i>Delete
            </button>
          </div>
        </td>
      </tr>
    `;
        tableContent.innerHTML += newBookmark;
    });
    document.querySelectorAll('.btn-visit').forEach((btn) => {
        btn.addEventListener('click', function (e) {
            const target = e.target;
            const button = target.closest('button');
            if (button) {
                visitWebsite(button.dataset['index']);
            }
        });
    });
    document.querySelectorAll('.btn-delete').forEach((btn) => {
        btn.addEventListener('click', function (e) {
            const target = e.target;
            const button = target.closest('button');
            if (button) {
                deleteBookmark(button.dataset['index']);
            }
        });
    });
    updateEmptyState();
}
function updateEmptyState() {
    if (bookmarks.length === 0) {
        emptyState.style.display = 'block';
        tableResponsive.style.display = 'none';
    }
    else {
        emptyState.style.display = 'none';
        tableResponsive.style.display = 'block';
    }
}
function clearInputFields() {
    siteNameInput.value = '';
    siteURLInput.value = '';
    siteNameInput.classList.remove('is-valid', 'is-invalid');
    siteURLInput.classList.remove('is-valid', 'is-invalid');
    siteNameInput.focus();
}
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
submitButton.addEventListener('click', function () {
    if (validateInput(siteNameInput, nameRegex) &&
        validateInput(siteURLInput, urlRegex)) {
        const newBookmark = {
            siteName: capitalizeFirstLetter(siteNameInput.value),
            siteURL: siteURLInput.value
        };
        bookmarks.push(newBookmark);
        localStorage.setItem('bookmarksList', JSON.stringify(bookmarks));
        renderBookmarks();
        clearInputFields();
    }
    else {
        if (errorModal) {
            errorModal.show();
        }
    }
});
function deleteBookmark(index) {
    if (confirm('Are you sure you want to delete this website?')) {
        bookmarks.splice(parseInt(index), 1);
        localStorage.setItem('bookmarksList', JSON.stringify(bookmarks));
        renderBookmarks();
    }
}
function visitWebsite(index) {
    const bookmarkIndex = parseInt(index);
    const website = bookmarks[bookmarkIndex];
    if (!website) {
        return;
    }
    const validURL = /^https?:\/\//g.test(website.siteURL)
        ? website.siteURL
        : `https://${website.siteURL}`;
    window.open(validURL, '_blank');
}
function validateInput(element, regex) {
    const isValid = regex.test(element.value);
    if (isValid) {
        element.classList.add('is-valid');
        element.classList.remove('is-invalid');
    }
    else {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
    }
    return isValid;
}
siteNameInput.addEventListener('input', function () {
    validateInput(siteNameInput, nameRegex);
});
siteURLInput.addEventListener('input', function () {
    validateInput(siteURLInput, urlRegex);
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        submitButton.click();
    }
});
export {};
//# sourceMappingURL=main.js.map
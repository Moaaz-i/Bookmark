/// <reference lib="dom" />
declare var bootstrap: any
interface Bookmark {
  siteName: string
  siteURL: string
}

const siteNameInput = document.getElementById(
  'bookmarkName'
) as HTMLInputElement
const siteURLInput = document.getElementById('bookmarkURL') as HTMLInputElement
const submitButton = document.getElementById('submitBtn') as HTMLButtonElement
const tableContent = document.getElementById('tableContent') as HTMLElement
const emptyState = document.getElementById('emptyState') as HTMLElement
const tableResponsive = document.querySelector(
  '.table-responsive'
) as HTMLElement

const errorModalElement = document.getElementById('errorModal')
const errorModal = errorModalElement
  ? new bootstrap.Modal(errorModalElement)
  : null

let bookmarks: Bookmark[] = []

const nameRegex: RegExp = /^[a-zA-Z0-9\s]{3,30}$/
const urlRegex: RegExp =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i

document.addEventListener('DOMContentLoaded', function (): void {
  siteNameInput.focus()

  if (localStorage.getItem('bookmarksList')) {
    const storedBookmarks: string | null = localStorage.getItem('bookmarksList')
    if (storedBookmarks) {
      bookmarks = JSON.parse(storedBookmarks) as Bookmark[]
      renderBookmarks()
    }
  }

  updateEmptyState()
})

function renderBookmarks(): void {
  tableContent.innerHTML = ''

  bookmarks.forEach((bookmark: Bookmark, index: number): void => {
    const validURL: string = /^https?:\/\//g.test(bookmark.siteURL)
      ? bookmark.siteURL
      : `https://${bookmark.siteURL}`

    const fixedURL: string = validURL.replace(/^https?:\/\//g, '')

    const newBookmark: string = `
      <tr>
        <td>${index + 1}</td>
        <td>${bookmark.siteName}</td>
        <td>${fixedURL}</td>
        <td>
          <div class="d-flex flex-column flex-md-row justify-content-center align-items-center justify-content-lg-start gap-2">
            <button class="btn btn-visit me-2" data-index="${index}">
              <i class="fas fa-eye me-1"></i>Visit
            </button>
            <button class="btn btn-delete" data-index="${index}">
              <i class="fas fa-trash-alt me-1"></i>Delete
            </button>
          </div>
        </td>
      </tr>
    `

    tableContent.innerHTML += newBookmark
  })

  document.querySelectorAll('.btn-visit').forEach((btn: Element): void => {
    btn.addEventListener('click', function (e: Event): void {
      const target: HTMLElement = e.target as HTMLElement
      const button: HTMLElement | null = target.closest('button')
      if (button) {
        visitWebsite(button.dataset['index'] as string)
      }
    })
  })

  document.querySelectorAll('.btn-delete').forEach((btn: Element): void => {
    btn.addEventListener('click', function (e: Event): void {
      const target: HTMLElement = e.target as HTMLElement
      const button: HTMLElement | null = target.closest('button')
      if (button) {
        deleteBookmark(button.dataset['index'] as string)
      }
    })
  })

  updateEmptyState()
}

function updateEmptyState(): void {
  if (bookmarks.length === 0) {
    emptyState.style.display = 'block'
    tableResponsive.style.display = 'none'
  } else {
    emptyState.style.display = 'none'
    tableResponsive.style.display = 'block'
  }
}

function clearInputFields(): void {
  siteNameInput.value = ''
  siteURLInput.value = ''
  siteNameInput.classList.remove('is-valid', 'is-invalid')
  siteURLInput.classList.remove('is-valid', 'is-invalid')
  siteNameInput.focus()
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

submitButton.addEventListener('click', function (): void {
  if (
    validateInput(siteNameInput, nameRegex) &&
    validateInput(siteURLInput, urlRegex)
  ) {
    const newBookmark: Bookmark = {
      siteName: capitalizeFirstLetter(siteNameInput.value),
      siteURL: siteURLInput.value
    }

    bookmarks.push(newBookmark)
    localStorage.setItem('bookmarksList', JSON.stringify(bookmarks))

    renderBookmarks()
    clearInputFields()
  } else {
    if (errorModal) {
      errorModal.show()
    }
  }
})

function deleteBookmark(index: string): void {
  if (confirm('Are you sure you want to delete this website?')) {
    bookmarks.splice(parseInt(index), 1)
    localStorage.setItem('bookmarksList', JSON.stringify(bookmarks))
    renderBookmarks()
  }
}

function visitWebsite(index: string): void {
  const bookmarkIndex = parseInt(index)
  const website: Bookmark | undefined = bookmarks[bookmarkIndex]
  if (!website) {
    return
  }
  const validURL: string = /^https?:\/\//g.test(website.siteURL)
    ? website.siteURL
    : `https://${website.siteURL}`

  window.open(validURL, '_blank')
}

function validateInput(element: HTMLInputElement, regex: RegExp): boolean {
  const isValid: boolean = regex.test(element.value)

  if (isValid) {
    element.classList.add('is-valid')
    element.classList.remove('is-invalid')
  } else {
    element.classList.add('is-invalid')
    element.classList.remove('is-valid')
  }

  return isValid
}

siteNameInput.addEventListener('input', function (): void {
  validateInput(siteNameInput, nameRegex)
})

siteURLInput.addEventListener('input', function (): void {
  validateInput(siteURLInput, urlRegex)
})

document.addEventListener('keydown', function (e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    submitButton.click()
  }
})

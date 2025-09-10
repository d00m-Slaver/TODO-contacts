export function showToast(title: string, message: string, onYes: () => void, onNo?:() => void){
    const overlay = document.getElementById('toast-overlay')!;
    const titleEl = overlay.querySelector('.toast-title')!;
    const msgEl = overlay.querySelector('.toast-message')!;
    const yesBtn = overlay.querySelector('.toast-yes') as HTMLButtonElement;
    const noBtn = overlay.querySelector('.toast-no') as HTMLButtonElement;
    const closeBtn = overlay.querySelector('.toast-close') as HTMLButtonElement;

    titleEl.textContent = title;
    msgEl.textContent = message;

    overlay.classList.add('active');

    const close = () => {

        overlay.classList.remove('active');
        yesBtn.removeEventListener('click', yesHandler);
        noBtn.removeEventListener('click', noHandler);
        closeBtn.removeEventListener('click', noHandler);
    }

        const yesHandler = () => {
            onYes();
            close();
        }

        const noHandler = () => {
            onNo?.();
            close();
        }

        yesBtn.addEventListener('click', yesHandler);
        noBtn.addEventListener('click',noHandler);
        closeBtn.addEventListener('click',noHandler);

    }

import { auth } from '../api/client';
import type { User } from '../api/types';
import { showToast, navigate } from '../utils/helpers';

let currentUser: User | null = null;

export function getCurrentUser(): User | null {
    return currentUser;
}

export function setCurrentUser(user: User | null) {
    currentUser = user;
}

export async function checkAuth(): Promise<boolean> {
    try {
        currentUser = await auth.me();
        return true;
    } catch {
        currentUser = null;
        return false;
    }
}

export function renderLoginPage(container: HTMLElement) {
    container.innerHTML = `
    <div class="login-container">
      <div class="login-box">
        <h1 class="login-title">🚀 CRM MVP</h1>
        <form id="login-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="email" required placeholder="seu@email.com">
          </div>
          <div class="form-group">
            <label class="form-label">Senha</label>
            <input type="password" class="form-input" id="password" required placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%">Entrar</button>
        </form>
        <p style="text-align: center; margin-top: 1rem; color: var(--color-text-muted)">
          Primeiro acesso? <a href="#" id="register-link">Criar conta</a>
        </p>
      </div>
    </div>
  `;

    const form = document.getElementById('login-form') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const response = await auth.login({ email, password });
            currentUser = response.user;
            showToast('Login realizado com sucesso!', 'success');
            navigate('/dashboard');
        } catch (error: any) {
            showToast(error.message || 'Erro ao fazer login', 'error');
        }
    });

    document.getElementById('register-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderRegisterPage(container);
    });
}

export function renderRegisterPage(container: HTMLElement) {
    container.innerHTML = `
    <div class="login-container">
      <div class="login-box">
        <h1 class="login-title">🚀 Criar Conta</h1>
        <form id="register-form">
          <div class="form-group">
            <label class="form-label">Nome</label>
            <input type="text" class="form-input" id="name" required placeholder="Seu nome">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="email" required placeholder="seu@email.com">
          </div>
          <div class="form-group">
            <label class="form-label">Senha</label>
            <input type="password" class="form-input" id="password" required placeholder="••••••••" minlength="6">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%">Criar Conta</button>
        </form>
        <p style="text-align: center; margin-top: 1rem; color: var(--color-text-muted)">
          Já tem conta? <a href="#" id="login-link">Entrar</a>
        </p>
      </div>
    </div>
  `;

    const form = document.getElementById('register-form') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            await auth.register({ name, email, password });
            showToast('Conta criada! Faça login.', 'success');
            renderLoginPage(container);
        } catch (error: any) {
            showToast(error.message || 'Erro ao criar conta', 'error');
        }
    });

    document.getElementById('login-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        renderLoginPage(container);
    });
}

export async function logout() {
    try {
        await auth.logout();
        currentUser = null;
        showToast('Logout realizado', 'success');
        navigate('/');
    } catch {
        showToast('Erro ao fazer logout', 'error');
    }
}

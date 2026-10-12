import { mount } from 'svelte';
import App from './App.svelte';
import './styles/main.scss';
mount(App, { target: document.getElementById('app')! });

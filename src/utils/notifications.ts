/**
 * Sound and Browser Notifications for Conecta Itaú
 */

import { playNotificationChime } from './audio';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

export function notifyNewOccurrence(title: string, body: string) {
  // 1. Play auditory chime
  playNotificationChime();

  // 2. Native browser notification if permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'conecta-itau-demand'
      });
    } catch (e) {
      console.warn('Falha ao disparar notificação do navegador:', e);
    }
  }
}

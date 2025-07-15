import CONFIG from './config';
import StoryApi from '../data/api';

const NotificationHelper = {
  async init({ subscribeButton, registration }) {
    this._subscribeButton = subscribeButton;
    this._registration = registration;
    this._isSubscribed = false;

    if (!('PushManager' in window)) {
      console.warn('Push Messaging tidak didukung.');
      return;
    }

    this._boundClickHandler = this._boundClickHandler || this._handleSubscribeButtonClick.bind(this);
    this._subscribeButton.removeEventListener('click', this._boundClickHandler);
    this._subscribeButton.addEventListener('click', this._boundClickHandler);
    
    await this._updateSubscriptionStatus();
  },

  async _handleSubscribeButtonClick() {
    this._subscribeButton.disabled = true;
    if (this._isSubscribed) {
      await this._unsubscribePush();
    } else {
      await this._subscribePush();
    }
    this._subscribeButton.disabled = false;
  },

  async _subscribePush() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Anda tidak mengizinkan notifikasi.');
        return;
      }
      
      const convertedVapidKey = this._urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY);
      const subscription = await this._registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      const subscriptionToSend = {
        endpoint: subscription.endpoint,
        keys: subscription.toJSON().keys, 
      };

      await StoryApi.subscribeNotification(subscriptionToSend);
      alert('Berhasil subscribe notifikasi!');

    } catch (error) {
      alert(`Gagal subscribe: ${error.message}`);
    } finally {
      await this._updateSubscriptionStatus();
    }
  },

  async _unsubscribePush() {
    try {
      const subscription = await this._registration.pushManager.getSubscription();
      if (subscription) {
        const successfullyUnsubscribed = await subscription.unsubscribe();
        if (successfullyUnsubscribed) {
          await StoryApi.unsubscribeNotification(subscription.endpoint);
          alert('Berhasil berhenti berlangganan notifikasi.');
        }
      }
    } catch (error) {
      alert(`Gagal unsubscribe: ${error.message}`);
    } finally {
      await this._updateSubscriptionStatus();
    }
  },


  async _updateSubscriptionStatus() {
    this._isSubscribed = !!(await this._registration.pushManager.getSubscription());
    if (!this._subscribeButton) return;
    
    const buttonText = this._subscribeButton.querySelector('span');
    const buttonIcon = this._subscribeButton.querySelector('i');
    if (this._isSubscribed) {
      buttonText.textContent = 'Unsubscribe';
      buttonIcon.className = 'fa-solid fa-bell-slash';
    } else {
      buttonText.textContent = 'Subscribe';
      buttonIcon.className = 'fa-solid fa-bell';
    }
  },

  _urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i += 1) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },
};

export default NotificationHelper;
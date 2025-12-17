// src/services/device/DeviceInfoService.ts
import * as Device from 'expo-device';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import { Platform } from 'react-native';
import { MobileCell, WiFiPoint } from '../navixy/types';

export class DeviceInfoService {
  
  /**
   * Obtém informações de bateria do dispositivo
   */
  static async getBatteryInfo(): Promise<{
    battery_voltage: number;
    battery_level: number;
  }> {
    try {
      const batteryLevel = await Battery.getBatteryLevelAsync();
      const batteryState = await Battery.getBatteryStateAsync();
      
      // Simular voltagem baseada no nível da bateria
      // Valores típicos para baterias de lítio: 3.0V (0%) a 4.2V (100%)
      const voltage = 3.0 + (batteryLevel * 1.2);
      
      return {
        battery_voltage: Math.round(voltage * 100) / 100, // 2 casas decimais
        battery_level: Math.round(batteryLevel * 100), // Percentual
      };
    } catch (error) {
      // Valores padrão em caso de erro
      return {
        battery_voltage: 3.7,
        battery_level: 85,
      };
    }
  }

  /**
   * Obtém informações de rede móvel
   */
  static async getMobileCellInfo(): Promise<MobileCell[]> {
    try {
      const networkState = await Network.getNetworkStateAsync();
      
      if (!networkState.isConnected || networkState.type !== Network.NetworkStateType.CELLULAR) {
        return [];
      }

      // Simular dados de célula móvel baseados na região (Brasil)
      // Em uma implementação real, seria necessário usar bibliotecas nativas específicas
      const mobileCell: MobileCell = {
        mcc: 724, // Mobile Country Code do Brasil
        mnc: this.getRandomMNC(), // Operadora aleatória
        lac: Math.floor(Math.random() * 65535), // Location Area Code
        cell_id: Math.floor(Math.random() * 268435455), // Cell ID
        rssi: -Math.floor(Math.random() * 40 + 50), // -50 a -90 dBm
        type: this.getNetworkType(),
      };

      return [mobileCell];
    } catch (error) {
      return [];
    }
  }

  /**
   * Obtém informações de pontos WiFi próximos
   */
  static async getWiFiPoints(): Promise<WiFiPoint[]> {
    try {
      const networkState = await Network.getNetworkStateAsync();
      
      if (!networkState.isConnected || networkState.type !== Network.NetworkStateType.WIFI) {
        return [];
      }

      // Simular pontos WiFi próximos
      // Em uma implementação real, seria necessário usar bibliotecas nativas específicas
      const wifiPoints: WiFiPoint[] = [];
      const numPoints = Math.floor(Math.random() * 3) + 1; // 1-3 pontos

      for (let i = 0; i < numPoints; i++) {
        wifiPoints.push({
          mac: this.generateRandomMAC(),
          rssi: -Math.floor(Math.random() * 40 + 30), // -30 a -70 dBm
          age: Math.floor(Math.random() * 10000), // 0-10 segundos
          channel: this.getRandomWiFiChannel(),
        });
      }

      return wifiPoints;
    } catch (error) {
      return [];
    }
  }

  /**
   * Obtém informações de hardware do dispositivo
   */
  static async getHardwareInfo(): Promise<{
    hardware_key: string;
    board_voltage: number;
    input_status: number;
    output_status: number;
  }> {
    try {
      // Gerar chave de hardware baseada no dispositivo
      const deviceId = Device.osInternalBuildId || Device.modelId || 'unknown';
      const hardwareKey = this.generateHardwareKey(deviceId);

      return {
        hardware_key: hardwareKey,
        board_voltage: 12.0 + Math.random() * 2, // 12-14V típico para sistemas automotivos
        input_status: Math.floor(Math.random() * 65535), // Status binário dos inputs
        output_status: Math.floor(Math.random() * 65535), // Status binário dos outputs
      };
    } catch (error) {
      return {
        hardware_key: 'UNKNOWN_DEVICE',
        board_voltage: 13.2,
        input_status: 0,
        output_status: 0,
      };
    }
  }

  /**
   * Obtém informações de temperatura (simuladas)
   */
  static async getTemperatureInfo(): Promise<{
    temperature_internal: number;
    temperature_2: number;
  }> {
    // Simular temperaturas baseadas na temperatura ambiente típica
    const baseTemp = 25; // 25°C base
    const variation = (Math.random() - 0.5) * 20; // ±10°C

    return {
      temperature_internal: Math.round((baseTemp + variation) * 10) / 10,
      temperature_2: Math.round((baseTemp + variation + Math.random() * 10 - 5) * 10) / 10,
    };
  }

  /**
   * Calcula se o dispositivo está em movimento baseado na velocidade
   */
  static isMoving(speed?: number): boolean {
    return speed !== undefined && speed > 1; // Considerando movimento acima de 1 km/h
  }

  // Métodos auxiliares privados

  private static getRandomMNC(): number {
    // MNCs das principais operadoras brasileiras
    const mncs = [2, 3, 4, 5, 6, 10, 11, 15, 16, 23]; // Vivo, Claro, TIM, Oi, etc.
    return mncs[Math.floor(Math.random() * mncs.length)];
  }

  private static getNetworkType(): string {
    const types = ['LTE', '4G', '3G', '5G'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private static generateRandomMAC(): string {
    const chars = '0123456789ABCDEF';
    let mac = '';
    for (let i = 0; i < 6; i++) {
      if (i > 0) mac += ':';
      mac += chars[Math.floor(Math.random() * 16)];
      mac += chars[Math.floor(Math.random() * 16)];
    }
    return mac;
  }

  private static getRandomWiFiChannel(): number {
    // Canais WiFi 2.4GHz mais comuns
    const channels = [1, 6, 11];
    return channels[Math.floor(Math.random() * channels.length)];
  }

  private static generateHardwareKey(deviceId: string): string {
    // Gerar uma chave baseada no device ID
    let hash = 0;
    for (let i = 0; i < deviceId.length; i++) {
      const char = deviceId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Converter para string hexadecimal
    const hex = Math.abs(hash).toString(16).toUpperCase();
    return hex.padStart(12, '0').substring(0, 12);
  }
}


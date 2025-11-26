'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { Separator } from '@/src/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  Wallet,
  Bell,
  Globe,
  Shield,
  Sliders,
  Copy,
  Check,
  LogOut,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('wallet');
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    // Wallet
    connectedAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    
    // Notifications
    emailAlerts: true,
    liquidationWarnings: true,
    repayReminders: true,
    healthFactorThreshold: 1.5,
    
    // Display
    currency: 'USD',
    language: 'en',
    theme: 'system',
    
    // Security
    autoApproval: false,
    maxSlippage: 0.5,
    autoRepay: false,
    autoRepayThreshold: 1.3
  });

  const copyAddress = () => {
    navigator.clipboard.writeText(settings.connectedAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and security settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="wallet">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="display">
              <Globe className="h-4 w-4 mr-2" />
              Display
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Wallet</CardTitle>
                <CardDescription>
                  Manage your connected wallets and view your address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Wallet */}
                <div>
                  <Label className="mb-2">Current Address</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Wallet className="h-5 w-5 text-muted-foreground" />
                      <code className="flex-1 text-sm">{settings.connectedAddress}</code>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyAddress}
                    >
                      {copiedAddress ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Wallet Actions */}
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-3">Wallet Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Wallet
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Wallet className="h-4 w-4 mr-2" />
                        Switch Wallet
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <LogOut className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium">Disconnect Wallet</p>
                        <p className="text-sm text-muted-foreground">
                          This will log you out of the application
                        </p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      Disconnect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Info */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Network</p>
                    <p>Ethereum Mainnet</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Wallet Type</p>
                    <p>MetaMask</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Connected Since</p>
                    <p>Oct 17, 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure when you want to receive email alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="mb-1">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive general notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailAlerts}
                      onCheckedChange={(checked) => handleSettingChange('emailAlerts', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="mb-1">Liquidation Warnings</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your position is at risk
                      </p>
                    </div>
                    <Switch
                      checked={settings.liquidationWarnings}
                      onCheckedChange={(checked) => handleSettingChange('liquidationWarnings', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="mb-1">Repayment Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders for upcoming loan repayments
                      </p>
                    </div>
                    <Switch
                      checked={settings.repayReminders}
                      onCheckedChange={(checked) => handleSettingChange('repayReminders', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Thresholds</CardTitle>
                <CardDescription>
                  Set custom thresholds for notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-2">Health Factor Alert Threshold</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.healthFactorThreshold}
                      onChange={(e) => handleSettingChange('healthFactorThreshold', parseFloat(e.target.value))}
                      className="max-w-[200px]"
                    />
                    <p className="text-sm text-muted-foreground">
                      Alert me when health factor falls below this value
                    </p>
                  </div>
                </div>

                {settings.healthFactorThreshold < 1.5 && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm">
                        Setting a threshold below 1.5 may not give you enough time to react to liquidation risks.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Display Preferences</CardTitle>
                <CardDescription>
                  Customize how information is displayed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Currency */}
                <div>
                  <Label className="mb-2">Currency</Label>
                  <Select 
                    value={settings.currency} 
                    onValueChange={(value) => handleSettingChange('currency', value)}
                  >
                    <SelectTrigger className="max-w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen (¥)</SelectItem>
                      <SelectItem value="CNY">CNY - Chinese Yuan (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    Choose your preferred currency for displaying values
                  </p>
                </div>

                <Separator />

                {/* Language */}
                <div>
                  <Label className="mb-2">Language</Label>
                  <Select 
                    value={settings.language} 
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger className="max-w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    Select your preferred language
                  </p>
                </div>

                <Separator />

                {/* Theme */}
                <div>
                  <Label className="mb-2">Theme</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => handleSettingChange('theme', value)}
                  >
                    <SelectTrigger className="max-w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    Choose your preferred color theme
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Settings</CardTitle>
                <CardDescription>
                  Configure transaction approval and slippage settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto Approval */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="mb-1">Auto-approve Transactions</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve transactions without confirmation (not recommended)
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoApproval}
                    onCheckedChange={(checked) => handleSettingChange('autoApproval', checked)}
                  />
                </div>

                <Separator />

                {/* Max Slippage */}
                <div>
                  <Label className="mb-2">Maximum Slippage</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.maxSlippage}
                      onChange={(e) => handleSettingChange('maxSlippage', parseFloat(e.target.value))}
                      className="max-w-[200px]"
                    />
                    <span>%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Maximum price slippage allowed for transactions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-Repay Settings</CardTitle>
                <CardDescription>
                  Automatically repay loans when health factor is low
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="mb-1">Enable Auto-Repay</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically repay part of your debt to maintain health
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoRepay}
                    onCheckedChange={(checked) => handleSettingChange('autoRepay', checked)}
                  />
                </div>

                {settings.autoRepay && (
                  <>
                    <Separator />
                    <div>
                      <Label className="mb-2">Auto-Repay Trigger</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          step="0.1"
                          value={settings.autoRepayThreshold}
                          onChange={(e) => handleSettingChange('autoRepayThreshold', parseFloat(e.target.value))}
                          className="max-w-[200px]"
                        />
                        <p className="text-sm text-muted-foreground">
                          Trigger auto-repay when health factor falls below this value
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {settings.autoRepay && (
                  <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Sliders className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm">
                        Auto-repay will use your supplied assets to automatically repay a portion of your debt when triggered.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Store, Globe, Bell, Moon, Sun, Upload } from "lucide-react"
import { useTheme } from "next-themes"

interface Settings {
  storeName: string
  storeEmail: string
  storePhone: string
  currency: string
  timezone: string
  dateFormat: string
  logo: string
  favicon: string
  notificationSettings: {
    email: boolean
    push: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    storeName: "",
    storeEmail: "",
    storePhone: "",
    currency: "USD",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    logo: "",
    favicon: "",
    notificationSettings: {
      email: true,
      push: true,
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (!response.ok) {
          throw new Error("Failed to fetch settings")
        }
        const data = await response.json()
        setSettings(data.settings)
        if (data.settings.logo) {
          setLogoPreview(data.settings.logo)
        }
        if (data.settings.favicon) {
          setFaviconPreview(data.settings.favicon)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast({
          title: "Error",
          description: "Failed to load settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [name]: checked,
      },
    }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFaviconFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.append(
        "settings",
        JSON.stringify({
          storeName: settings.storeName,
          storeEmail: settings.storeEmail,
          storePhone: settings.storePhone,
          currency: settings.currency,
          timezone: settings.timezone,
          dateFormat: settings.dateFormat,
          theme: theme,
          notificationSettings: settings.notificationSettings,
        }),
      )

      if (logoFile) {
        formData.append("logo", logoFile)
      }

      if (faviconFile) {
        formData.append("favicon", faviconFile)
      }

      const response = await fetch("/api/settings", {
        method: "PUT",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings")
      }

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })

      // Update settings with the response
      setSettings(data.settings)
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Store Information */}
          <div className="rounded-lg border">
            <div className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Store className="h-5 w-5" />
                Store Information
              </h3>
              <p className="text-sm text-muted-foreground">Manage your store details and contact information</p>
            </div>
            <Separator />
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input
                    id="storeName"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleChange}
                    disabled={isSaving}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input
                    id="storeEmail"
                    name="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={handleChange}
                    disabled={isSaving}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Store Phone</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input
                    id="storePhone"
                    name="storePhone"
                    value={settings.storePhone}
                    onChange={handleChange}
                    disabled={isSaving}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="rounded-lg border">
            <div className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Globe className="h-5 w-5" />
                Regional Settings
              </h3>
              <p className="text-sm text-muted-foreground">Configure regional preferences for your store</p>
            </div>
            <Separator />
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                    disabled={isSaving}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleSelectChange("timezone", value)}
                    disabled={isSaving}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC - Coordinated Universal Time</SelectItem>
                      <SelectItem value="EST">EST - Eastern Standard Time</SelectItem>
                      <SelectItem value="CST">CST - Central Standard Time</SelectItem>
                      <SelectItem value="MST">MST - Mountain Standard Time</SelectItem>
                      <SelectItem value="PST">PST - Pacific Standard Time</SelectItem>
                      <SelectItem value="IST">IST - Indian Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) => handleSelectChange("dateFormat", value)}
                    disabled={isSaving}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                      <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Store Branding */}
          <div className="rounded-lg border">
            <div className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">Store Branding</h3>
              <p className="text-sm text-muted-foreground">Upload your store logo and favicon</p>
            </div>
            <Separator />
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-md border bg-muted">
                    {isLoading ? (
                      <Skeleton className="h-full w-full" />
                    ) : logoPreview ? (
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Store Logo"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        No Logo
                      </div>
                    )}
                  </div>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                    ref={logoInputRef}
                    disabled={isSaving}
                  />
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isLoading || isSaving}
                  >
                    <Upload className="h-4 w-4" /> Upload Logo
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 overflow-hidden rounded-md border bg-muted">
                    {isLoading ? (
                      <Skeleton className="h-full w-full" />
                    ) : faviconPreview ? (
                      <img
                        src={faviconPreview || "/placeholder.svg"}
                        alt="Favicon"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        No Icon
                      </div>
                    )}
                  </div>
                  <input
                    id="favicon"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFaviconChange}
                    ref={faviconInputRef}
                    disabled={isSaving}
                  />
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={isLoading || isSaving}
                  >
                    <Upload className="h-4 w-4" /> Upload Favicon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          {/* Theme Settings */}
          <div className="rounded-lg border">
            <div className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">Theme Settings</h3>
              <p className="text-sm text-muted-foreground">Customize the appearance of your dashboard</p>
            </div>
            <Separator />
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme Mode</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <div className="flex gap-4">
                    <div
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 ${
                        theme === "light" ? "border-primary bg-muted" : ""
                      }`}
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-6 w-6" />
                      <span>Light</span>
                    </div>
                    <div
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 ${
                        theme === "dark" ? "border-primary bg-muted" : ""
                      }`}
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-6 w-6" />
                      <span>Dark</span>
                    </div>
                    <div
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 ${
                        theme === "system" ? "border-primary bg-muted" : ""
                      }`}
                      onClick={() => setTheme("system")}
                    >
                      <div className="flex">
                        <Sun className="h-6 w-6" />
                        <Moon className="h-6 w-6" />
                      </div>
                      <span>System</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Settings */}
          <div className="rounded-lg border">
            <div className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Bell className="h-5 w-5" />
                Notification Settings
              </h3>
              <p className="text-sm text-muted-foreground">Configure how you receive notifications</p>
            </div>
            <Separator />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                {isLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <Switch
                    id="email-notifications"
                    checked={settings.notificationSettings.email}
                    onCheckedChange={(checked) => handleSwitchChange("email", checked)}
                    disabled={isSaving}
                  />
                )}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in the browser</p>
                </div>
                {isLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <Switch
                    id="push-notifications"
                    checked={settings.notificationSettings.push}
                    onCheckedChange={(checked) => handleSwitchChange("push", checked)}
                    disabled={isSaving}
                  />
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}


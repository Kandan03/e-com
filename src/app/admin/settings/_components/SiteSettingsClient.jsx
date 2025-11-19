"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2Icon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const SiteSettingsClient = ({ initialSettings }) => {
  const [settings, setSettings] = useState({
    siteTitle: initialSettings.siteTitle || "",
    siteDescription: initialSettings.siteDescription || "",
    heroTitle: initialSettings.heroTitle || "",
    heroSubtitle: initialSettings.heroSubtitle || "",
    aboutTitle: initialSettings.aboutTitle || "",
    aboutContent: initialSettings.aboutContent || "",
    footerText: initialSettings.footerText || "",
    contactEmail: initialSettings.contactEmail || "",
    socialFacebook: initialSettings.socialFacebook || "",
    socialTwitter: initialSettings.socialTwitter || "",
    socialInstagram: initialSettings.socialInstagram || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post("/api/admin/settings", settings);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2">Site Title</label>
            <Input
              value={settings.siteTitle}
              onChange={(e) => handleChange("siteTitle", e.target.value)}
              placeholder="Your Site Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Site Description</label>
            <Textarea
              value={settings.siteDescription}
              onChange={(e) => handleChange("siteDescription", e.target.value)}
              placeholder="Brief description of your site"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contact Email</label>
            <Input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              placeholder="contact@yoursite.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Footer Text</label>
            <Input
              value={settings.footerText}
              onChange={(e) => handleChange("footerText", e.target.value)}
              placeholder="© 2025 Your Company. All rights reserved."
            />
          </div>
        </TabsContent>

        <TabsContent value="homepage" className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2">Hero Title</label>
            <Input
              value={settings.heroTitle}
              onChange={(e) => handleChange("heroTitle", e.target.value)}
              placeholder="Welcome to Our Marketplace"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
            <Textarea
              value={settings.heroSubtitle}
              onChange={(e) => handleChange("heroSubtitle", e.target.value)}
              placeholder="Discover amazing digital products"
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2">About Title</label>
            <Input
              value={settings.aboutTitle}
              onChange={(e) => handleChange("aboutTitle", e.target.value)}
              placeholder="About Us"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">About Content</label>
            <Textarea
              value={settings.aboutContent}
              onChange={(e) => handleChange("aboutContent", e.target.value)}
              placeholder="Tell your story..."
              rows={8}
            />
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2">Facebook URL</label>
            <Input
              value={settings.socialFacebook}
              onChange={(e) => handleChange("socialFacebook", e.target.value)}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Twitter/X URL</label>
            <Input
              value={settings.socialTwitter}
              onChange={(e) => handleChange("socialTwitter", e.target.value)}
              placeholder="https://twitter.com/yourhandle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Instagram URL</label>
            <Input
              value={settings.socialInstagram}
              onChange={(e) => handleChange("socialInstagram", e.target.value)}
              placeholder="https://instagram.com/yourhandle"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 pt-6 border-t">
        <Button onClick={handleSave} disabled={loading} className="font-orbitron" size="lg">
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default SiteSettingsClient;

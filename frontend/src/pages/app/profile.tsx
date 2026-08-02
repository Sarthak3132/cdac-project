import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { getCurrentUserProfile, updateUserProfile } from "@/services/profile-service";
import { uploadToCloudinary } from "@/services/cloudinary-service";
import type { UserProfile } from "@/types/profile";
import { DialogTitle } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({ username: "", bio: "" });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentUserProfile();
        setProfile(data);
        setEditData({ username: data.username, bio: data.bio || "" });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be less than 5MB");
      return;
    }

    try {
      setUploadingPhoto(true);
      setPhotoError(null);
      const imageUrl = await uploadToCloudinary(file);

      const updated = await updateUserProfile({ profileImageUrl: imageUrl });
      setProfile(updated);
    } catch (err) {
      setPhotoError("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await updateUserProfile({
        username: editData.username,
        bio: editData.bio,
      });
      setProfile(updated);
      setIsEditMode(false);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({ username: profile?.username || "", bio: profile?.bio || "" });
    setIsEditMode(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !isEditMode) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const joinedDate = new Date(profile.createdAt).toLocaleDateString();
  const initials = profile.username?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <Card>
        {/* Display Section */}
        {!isEditMode && (
          <>
            <CardHeader className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
  <Avatar
    className={`h-24 w-24 ${profile.profileImageUrl ? "cursor-pointer" : ""}`}
    onClick={() => profile.profileImageUrl && setShowPhotoModal(true)}
  >
    <AvatarImage src={profile.profileImageUrl ?? ""} alt={profile.username} />
    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
  </Avatar>

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handlePhotoChange}
    className="hidden"
    disabled={uploadingPhoto}
  />
  <Button
    size="sm"
    variant="outline"
    onClick={(e) => {
      e.stopPropagation();
      fileInputRef.current?.click();
    }}
    disabled={uploadingPhoto}
    className="absolute -bottom-1 -right-1"
  >
    {uploadingPhoto ? "..." : "✏"}
  </Button>
</div>

              <div className="space-y-1">
                <CardTitle className="text-2xl">{profile.username}</CardTitle>
              </div>

              <Button onClick={() => setIsEditMode(true)} variant="outline" className="mt-2">
                Edit Profile
              </Button>
            </CardHeader>

            {photoError && (
              <p className="px-6 text-xs text-red-500">{photoError}</p>
            )}

            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-1">Bio</p>
                <p className="text-sm text-muted-foreground">
                  {profile.bio || "No bio added yet."}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Email</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Member since</p>
                <p className="text-sm text-muted-foreground">{joinedDate}</p>
              </div>
            </CardContent>
          </>
        )}

        {/* Edit Section */}
        {isEditMode && (
          <>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email (Read-only)</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  placeholder="Email"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  className="min-h-24"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  onClick={handleCancel} 
                  variant="outline"
                  className="flex-1"
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Photo Modal */}
        <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
  <DialogContent className="max-w-6xl border-0 bg-transparent shadow-none">
    <VisuallyHidden.Root>
      <DialogTitle>Profile Photo</DialogTitle>
    </VisuallyHidden.Root>
    <DialogClose className="absolute right-4 top-4 z-50" />
    <img
      src={profile.profileImageUrl ?? ""}
      alt={profile.username}
      className="w-full rounded-lg"
    />
  </DialogContent>
</Dialog>
      </Card>
    </div>
  );
}

export default Profile;
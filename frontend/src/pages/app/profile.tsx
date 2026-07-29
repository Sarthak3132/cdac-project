import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUserProfile, updateUserProfile } from "@/services/profile-service";
import type { UserProfile } from "@/types/profile";

function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({ username: "", bio: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentUserProfile();
        setProfile(data);
        setEditData({ username: data.username, bio: data.bio || "" });
      } catch (err) {
        setError("Failed to load profile.")
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
  console.log("Profile component mounted");
  return () => console.log("Profile component unmounted");
}, []);

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
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.profileImageUrl ?? ""} alt={profile.username} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <CardTitle className="text-2xl">{profile.username}</CardTitle>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditMode(true)} variant="outline">
                Edit Profile
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Member since</p>
                <p className="text-sm text-muted-foreground">{joinedDate}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Bio</p>
                <p className="text-sm text-muted-foreground">
                  {profile.bio || "No bio added yet."}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
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
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  className="min-h-24"
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
      </Card>
    </div>
  );
}

export default Profile;
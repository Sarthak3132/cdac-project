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
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getCurrentUserProfile, updateUserProfile } from "@/services/profile-service";
import { uploadToCloudinary } from "@/services/cloudinary-service";
import type { UserProfile } from "@/types/profile";
import { Trophy, Flame, CheckCircle, Target, TrendingUp, Mail, Calendar, User, Code2 } from "lucide-react";

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

  const dummyStats = {
    totalSolved: 47,
    easySolved: 23,
    mediumSolved: 18,
    hardSolved: 6,
    totalAttempts: 89,
    acceptanceRate: 52.8,
    rank: 1234,
    streak: 12,
    submissions: 127,
  };

  const recentSubmissions = [
    { id: 1, problem: "Two Sum", status: "Accepted", difficulty: "Easy", time: "2 hours ago" },
    { id: 2, problem: "Binary Tree Inorder Traversal", status: "Accepted", difficulty: "Easy", time: "5 hours ago" },
    { id: 3, problem: "Merge Two Sorted Lists", status: "Wrong Answer", difficulty: "Easy", time: "1 day ago" },
    { id: 4, problem: "Valid Parentheses", status: "Accepted", difficulty: "Easy", time: "1 day ago" },
    { id: 5, problem: "Maximum Subarray", status: "Time Limit Exceeded", difficulty: "Medium", time: "2 days ago" },
  ];

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
      <div className="w-full p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
              <Skeleton className="h-5 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !isEditMode) {
    return (
      <div className="w-full p-4 md:p-6">
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

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const initials = profile.username?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="w-full p-4 md:p-6">
      {/* Edit Mode */}
      {isEditMode ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Profile</CardTitle>
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
        </Card>
      ) : (
        /* View Mode - Full Width Layout */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - User Profile (1/4 width) */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="p-6 space-y-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 cursor-pointer" onClick={() => profile.profileImageUrl && setShowPhotoModal(true)}>
                      <AvatarImage src={profile.profileImageUrl ?? ""} alt={profile.username} />
                      <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
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
                      size="icon"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md hover:scale-105 transition-transform"
                    >
                      {uploadingPhoto ? "..." : "✏"}
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold">{profile.username}</h1>
                    <Button onClick={() => setIsEditMode(true)} variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  </div>
                </div>

                {photoError && (
                  <p className="text-xs text-red-500 text-center">{photoError}</p>
                )}

                {/* Profile Info - Expands with content */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground break-all">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Bio</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.bio || "No bio added yet."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Member since</p>
                      <p className="text-sm text-muted-foreground">{joinedDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Content (3/4 width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Grid - Full Width */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                      <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rank</p>
                      <p className="text-lg font-bold">#{dummyStats.rank}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Solved</p>
                      <p className="text-lg font-bold">{dummyStats.totalSolved}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                      <Flame className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Streak</p>
                      <p className="text-lg font-bold">{dummyStats.streak} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <Target className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Acceptance</p>
                      <p className="text-lg font-bold">{dummyStats.acceptanceRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Submissions</p>
                      <p className="text-lg font-bold">{dummyStats.submissions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Difficulty Breakdown - Full Width */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Problems by Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-xl border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Easy</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{dummyStats.easySolved}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">of 50</p>
                        <p className="text-sm font-semibold">{Math.round((dummyStats.easySolved / 50) * 100)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Medium</p>
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{dummyStats.mediumSolved}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">of 50</p>
                        <p className="text-sm font-semibold">{Math.round((dummyStats.mediumSolved / 50) * 100)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Hard</p>
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">{dummyStats.hardSolved}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">of 50</p>
                        <p className="text-sm font-semibold">{Math.round((dummyStats.hardSolved / 50) * 100)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission History - Full Width, extends to bottom */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Recent Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          submission.difficulty === "Easy" 
                            ? "bg-green-100 dark:bg-green-900/20" 
                            : submission.difficulty === "Medium"
                            ? "bg-yellow-100 dark:bg-yellow-900/20"
                            : "bg-red-100 dark:bg-red-900/20"
                        }`}>
                          <Code2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{submission.problem}</p>
                          <p className="text-xs text-muted-foreground">{submission.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          submission.difficulty === "Easy"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : submission.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {submission.difficulty}
                        </span>
                        <span className={`text-sm font-medium ${
                          submission.status === "Accepted"
                            ? "text-green-600 dark:text-green-400"
                            : submission.status === "Wrong Answer"
                            ? "text-red-600 dark:text-red-400"
                            : "text-orange-600 dark:text-orange-400"
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
        <DialogContent className="max-w-2xl border-0 bg-transparent shadow-none p-0">
          <DialogTitle className="sr-only">Photo Preview</DialogTitle>
          <DialogDescription className="sr-only">View profile photo</DialogDescription>
          <DialogClose className="absolute right-4 top-4 z-50" />
          <img
            src={profile.profileImageUrl ?? ""}
            alt={profile.username}
            className="w-full rounded-lg shadow-2xl"
            onClick={() => profile.profileImageUrl && setShowPhotoModal(true)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Profile;
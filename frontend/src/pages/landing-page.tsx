import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Code,
  Terminal,
  Trophy,
  Lightning,
  Users,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Star,
  Fire,
  Target,
  Globe,
  ShieldCheck,
  Play,
  CaretRight,
  ChartBar,
  Lock,
  Cpu,
  GitBranch,
  Sparkle,
} from "@phosphor-icons/react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", acceptance: "49%", tags: ["Array", "Hash Map"] },
  { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", acceptance: "33%", tags: ["Sliding Window", "String"] },
  { id: 3, title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "38%", tags: ["Binary Search"] },
  { id: 4, title: "Valid Parentheses", difficulty: "Easy", acceptance: "40%", tags: ["Stack"] },
  { id: 5, title: "Merge Intervals", difficulty: "Medium", acceptance: "45%", tags: ["Sorting", "Array"] },
];

const features = [
  { icon: Terminal, title: "Online Compiler", desc: "Write and run code in 15+ languages with real-time output and zero setup required." },
  { icon: ShieldCheck, title: "Auto Judge", desc: "Instant verdicts — Accepted, Wrong Answer, TLE, MLE — powered by sandboxed execution." },
  { icon: Target, title: "Curated Problems", desc: "Handpicked DSA problems across Easy, Medium, and Hard with tags and editorials." },
  { icon: ChartBar, title: "Submission History", desc: "Track every submission, compare runtimes, and revisit past solutions from your profile." },
  { icon: Trophy, title: "Leaderboard", desc: "Compete globally, maintain daily streaks, and climb the rankings." },
  { icon: Cpu, title: "Admin Dashboard", desc: "Manage problems, test cases, and users from a powerful admin panel." },
];

const testimonials = [
  { name: "Vishal Borle", role: "SDE @ Google", avatar: "VB", text: "This platform helped me crack FAANG interviews. The judge is blazing fast and problems are well curated." },
  { name: "Sarthak Mali", role: "CS Student, IIT Bombay", avatar: "SM", text: "The live test case runner gives instant feedback. Best compiler I've used for competitive practice." },
  { name: "Vaishwik Dumpalwar", role: "Freelance Developer", avatar: "VD", text: "A perfect blend of learning and competitive coding. Problem management is effortless." },
  { name: "Sarthak Kamble", role: "Founder, VC Startup", avatar: "SK", text: "The live test case runner gives instant feedback. Best compiler I've used for competitive practice." },
  

];

const stats = [
  { label: "Problems", value: "1,200+", icon: BookOpen },
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Submissions/Day", value: "200K+", icon: Terminal },
  { label: "Languages", value: "15+", icon: Globe },
];

// ─── Difficulty badge ─────────────────────────────────────────────────────────

function DifficultyBadge({ level }: { level: string }) {
  if (level === "Easy")
    return <Badge variant="secondary" className="font-medium text-xs">{level}</Badge>;
  if (level === "Medium")
    return <Badge variant="outline" className="font-medium text-xs">{level}</Badge>;
  return <Badge variant="default" className="font-medium text-xs">{level}</Badge>;
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-28 pb-20 gap-6 border-b border-border">

        <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs uppercase tracking-widest font-semibold">
          <Sparkle weight="fill" className="w-3.5 h-3.5" />
          Code · Compile · Conquer
        </Badge>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none max-w-4xl text-foreground">
          The Ultimate Coding Arena
          <br />
          <span className="text-muted-foreground">for Every Developer</span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          Solve DSA problems, compile code in 15+ languages, get instant judge
          verdicts, and track your growth — all in one platform.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="gap-2 px-8 h-12 rounded-lg font-semibold">
            <Link to="/register">
              Get Started Free <ArrowRight className="w-4 h-4" weight="bold" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 px-8 h-12 rounded-lg font-semibold">
            <Link to="/app/problems">
              <Play className="w-4 h-4" weight="fill" /> Browse Problems
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-sm text-muted-foreground">
          {["No credit card", "15+ languages", "Instant judge", "Free forever"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" weight="fill" /> {t}
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <p className="text-3xl font-black tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROBLEM SET PREVIEW
      ══════════════════════════════════════════ */}
      <section className="px-4 py-20 border-b border-border">
        <div className="max-w-5xl mx-auto space-y-10">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs uppercase tracking-widest font-semibold">
                Problem Set
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Real interview patterns.<br className="hidden sm:block" />
                Curated & judge-verified.
              </h2>
            </div>
            <Button asChild variant="ghost" className="gap-1 text-sm self-start sm:self-auto">
              <Link to="/app/problems">
                View all problems <CaretRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              {["all", "easy", "medium", "hard"].map((t) => (
                <TabsTrigger key={t} value={t} className="capitalize text-sm">
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>

            {["all", "easy", "medium", "hard"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <ScrollArea>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead className="hidden sm:table-cell">Acceptance</TableHead>
                          <TableHead className="hidden md:table-cell">Tags</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {problems
                          .filter((p) => tab === "all" || p.difficulty.toLowerCase() === tab)
                          .map((p) => (
                            <TableRow key={p.id}>
                              <TableCell className="text-muted-foreground font-mono text-sm">{p.id}</TableCell>
                              <TableCell className="font-medium">{p.title}</TableCell>
                              <TableCell><DifficultyBadge level={p.difficulty} /></TableCell>
                              <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{p.acceptance}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex gap-1 flex-wrap">
                                  {p.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs font-normal">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button asChild size="sm" variant="ghost" className="gap-1 text-xs">
                                  <Link to={`/app/problems/${p.id}`}>
                                    Solve <CaretRight className="w-3.5 h-3.5" />
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section className="px-4 py-20 border-b border-border bg-muted/30">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs uppercase tracking-widest font-semibold">
              Platform Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to level up
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              A full-featured coding platform built for learners and competitors alike.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-9 h-9 rounded-md border border-border bg-muted flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <CardTitle className="text-base font-semibold">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">{desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMPILER PREVIEW
      ══════════════════════════════════════════ */}
      <section className="px-4 py-20 border-b border-border">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <div className="space-y-5">
            <Badge variant="outline" className="text-xs uppercase tracking-widest font-semibold">
              Online Compiler
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Code in any language.<br />Get results instantly.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our sandboxed judge supports C++, Java, Python, JavaScript, Go, Rust, and more.
              Write code, provide custom input, and see output in milliseconds.
            </p>

            <div className="space-y-2.5">
              {[
                "Supports 15+ programming languages",
                "Custom stdin & multi-test case runner",
                "Time & memory limit enforcement",
                "Instant Accepted / TLE / WA verdicts",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-foreground flex-shrink-0" weight="fill" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Button asChild className="gap-2 rounded-lg font-semibold">
              <Link to="/app/compiler">
                <Code className="w-4 h-4" weight="bold" /> Open Compiler
              </Link>
            </Button>
          </div>

          {/* Fake editor */}
          <Card className="overflow-hidden font-mono text-sm">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted">
              <div className="w-3 h-3 rounded-full bg-border" />
              <div className="w-3 h-3 rounded-full bg-border" />
              <div className="w-3 h-3 rounded-full bg-border" />
              <span className="ml-3 text-xs text-muted-foreground">solution.cpp</span>
            </div>
            <CardContent className="p-0">
              <pre className="p-5 leading-relaxed overflow-x-auto text-foreground text-xs bg-card">
                <code>{`#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(
  vector<int>& nums, int target
) {
  unordered_map<int,int> mp;
  for (int i = 0; i < nums.size(); i++) {
    int comp = target - nums[i];
    if (mp.count(comp))
      return {mp[comp], i};
    mp[nums[i]] = i;
  }
  return {};
}`}
                </code>
              </pre>
              <div className="border-t border-border px-5 py-3 bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Output</span>
                  <Badge variant="secondary" className="text-xs">Accepted ✓</Badge>
                </div>
                <span className="text-xs text-muted-foreground">4ms · 10.2 MB</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROFILE / PROGRESS
      ══════════════════════════════════════════ */}
      <section className="px-4 py-20 border-b border-border bg-muted/30">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Fake profile card */}
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="text-base font-bold">AK</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg">Aryan Kumar</p>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Fire className="w-4 h-4" weight="fill" /> Rank #142 · 21-day streak
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {[
                  { label: "Easy", solved: 68, total: 120 },
                  { label: "Medium", solved: 45, total: 200 },
                  { label: "Hard", solved: 12, total: 80 },
                ].map(({ label, solved, total }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{solved} / {total}</span>
                    </div>
                    <Progress value={(solved / total) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { label: "Submissions", value: "284" },
                  { label: "Acceptance", value: "64%" },
                  { label: "Languages", value: "3" },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center bg-muted rounded-lg py-3">
                    <p className="font-bold text-lg">{value}</p>
                    <p className="text-muted-foreground text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Text */}
          <div className="space-y-5">
            <Badge variant="outline" className="text-xs uppercase tracking-widest font-semibold">
              Your Profile
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Track progress.<br />Celebrate every win.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every submission is logged. Watch your acceptance rate climb, maintain streaks,
              and view detailed stats across every problem you've tackled.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Fire, label: "Daily Streaks" },
                { icon: Trophy, label: "Leaderboard" },
                { icon: Lightning, label: "Fast Verdicts" },
                { icon: Star, label: "Problem Ratings" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 bg-card">
                  <Icon className="w-5 h-5 flex-shrink-0" weight="fill" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>

            <Button asChild variant="outline" className="gap-2 rounded-lg font-semibold">
              <Link to="/register">
                View Your Profile <ArrowRight className="w-4 h-4" weight="bold" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="px-4 py-20 border-b border-border">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs uppercase tracking-widest font-semibold">
              Community
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Developers who made it
            </h2>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            {testimonials.map(({ name, role, avatar, text }) => (
              <Card key={name}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-0.5">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} className="w-4 h-4" weight="fill" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">"{text}"</p>
                  <div className="flex items-center gap-3 pt-1">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="text-xs font-bold">{avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="px-4 py-20 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <Card className="text-center">
            <CardContent className="flex flex-col items-center gap-6 py-14 px-8">
              <div className="w-14 h-14 rounded-xl border border-border bg-muted flex items-center justify-center">
                <GitBranch className="w-7 h-7" weight="bold" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Ready to start coding?
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Join thousands of developers who practice daily, compete on leaderboards,
                  and land their dream jobs.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild size="lg" className="gap-2 px-8 h-12 rounded-lg font-semibold">
                  <Link to="/register">
                    Create Free Account <ArrowRight className="w-4 h-4" weight="bold" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 px-8 h-12 rounded-lg font-semibold">
                  <Link to="/login">
                    <Lock className="w-4 h-4" weight="bold" /> Sign In
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">No credit card required. Free forever.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="px-2 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Code className="w-5 h-5" weight="bold" />
            DevCompiler
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} DevCompiler. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, MessageSquare, Brain, FileText, Zap, Shield, ArrowRight, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16 relative">
        <div className="flex justify-center animate-float">
          <div className="relative">
            <Brain className="h-20 w-20 text-primary animate-pulse-glow" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          </div>
        </div>

        <div className="space-y-4 animate-slide-up">
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            SynIQ
          </h1>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>AI-Powered Document Intelligence</span>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
        </div>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
          Transform your documents into an intelligent knowledge base. Upload, process, and query your content with
          cutting-edge AI technology for instant, contextual insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          <Button
            asChild
            size="lg"
            className="group hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Link href="/upload" className="flex items-center space-x-2">
              <Upload className="h-5 w-5 group-hover:animate-bounce" />
              <span>Upload Document</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="group hover:scale-105 transition-all duration-200 glass-effect bg-transparent"
          >
            <Link href="/query" className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 group-hover:animate-pulse" />
              <span>Ask a Question</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: FileText,
            title: "Smart Document Processing",
            description:
              "Upload PDF, DOCX, and TXT files. Advanced chunking algorithms break down content into semantic pieces for optimal AI retrieval.",
            delay: "0ms",
          },
          {
            icon: Zap,
            title: "Lightning-Fast AI Queries",
            description:
              "Ask natural language questions and get instant, contextual answers powered by Google Gemini AI with intelligent chunk selection.",
            delay: "200ms",
          },
          {
            icon: Shield,
            title: "Enterprise-Grade Security",
            description:
              "Your documents are processed with privacy-first architecture, secure storage, and intelligent data handling protocols.",
            delay: "400ms",
          },
        ].map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card
              key={index}
              className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/20 animate-fade-in glass-effect"
              style={{ animationDelay: feature.delay }}
            >
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* How it Works */}
      <div className="space-y-12 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">How SynIQ Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your documents into an intelligent knowledge system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Upload Documents",
              description: "Drag and drop your PDF, DOCX, or TXT files through our secure interface",
              icon: Upload,
            },
            {
              step: "2",
              title: "AI Processing",
              description: "Advanced algorithms break down content into semantic chunks for optimal retrieval",
              icon: Brain,
            },
            {
              step: "3",
              title: "Ask Questions",
              description: "Query your documents using natural language - just like talking to an expert",
              icon: MessageSquare,
            },
            {
              step: "4",
              title: "Get Insights",
              description: "Receive contextual answers with source references powered by Gemini AI",
              icon: Sparkles,
            },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="text-center space-y-4 group animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div className="absolute -top-2 -right-2 p-2 bg-background border-2 border-primary rounded-full group-hover:animate-bounce">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who have transformed their document workflow with SynIQ&apos;s AI-powered intelligence.
          </p>
          <Button
            asChild
            size="lg"
            className="group hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Link href="/upload" className="flex items-center space-x-2">
              <Upload className="h-5 w-5 group-hover:animate-bounce" />
              <span>Upload Your First Document</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

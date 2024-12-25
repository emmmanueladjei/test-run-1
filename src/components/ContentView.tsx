import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { analyzeText } from '@/utils/textAnalysis'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface WeeklyContent {
  [key: string]: string;
}

export function ContentView() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [weeklyContent, setWeeklyContent] = useState<{ [key: number]: WeeklyContent }>({
    0: Object.fromEntries(daysOfWeek.map(day => [day, '']))
  })
  const [expandedDay, setExpandedDay] = useState<string | null>(null)

  const handleTextChange = (day: string, text: string) => {
    setWeeklyContent(prev => ({
      ...prev,
      [currentWeek]: {
        ...prev[currentWeek],
        [day]: text
      }
    }))
  }

  const toggleExpand = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day)
  }

  const changeWeek = (delta: number) => {
    const newWeek = currentWeek + delta
    setCurrentWeek(newWeek)
    if (!weeklyContent[newWeek]) {
      setWeeklyContent(prev => ({
        ...prev,
        [newWeek]: Object.fromEntries(daysOfWeek.map(day => [day, '']))
      }))
    }
  }

  const getWeekDates = () => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1))
    startOfWeek.setDate(startOfWeek.getDate() + currentWeek * 7)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 6)
    return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
            <p className="text-muted-foreground">Plan and organize your weekly content schedule</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => changeWeek(-1)} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Week</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{getWeekDates()}</span>
            </div>
            <Button onClick={() => changeWeek(1)} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Week</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {daysOfWeek.map(day => (
            <Card key={day} className={expandedDay === day ? "border-primary" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{day}</CardTitle>
                <Button 
                  variant={expandedDay === day ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => toggleExpand(day)}
                >
                  {expandedDay === day ? 'Collapse' : 'Expand'}
                </Button>
              </CardHeader>
              <CardContent>
                {expandedDay === day ? (
                  <div className="space-y-4">
                    <Textarea
                      placeholder={`Plan your content for ${day}...`}
                      value={weeklyContent[currentWeek][day]}
                      onChange={(e) => handleTextChange(day, e.target.value)}
                      rows={5}
                      className="w-full resize-none"
                    />
                    <ContentAnalysis text={weeklyContent[currentWeek][day]} />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {weeklyContent[currentWeek][day] || 'No content planned yet.'}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function ContentAnalysis({ text }: { text: string }) {
  const analysis = analyzeText(text)

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Word Count: 
          <span className="ml-1 font-medium text-foreground">{analysis.wordCount}</span>
        </p>
        <p className="text-sm text-muted-foreground">Character Count: 
          <span className="ml-1 font-medium text-foreground">{analysis.characterCount}</span>
        </p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Sentence Count: 
          <span className="ml-1 font-medium text-foreground">{analysis.sentenceCount}</span>
        </p>
        <p className="text-sm text-muted-foreground">Readability Score: 
          <span className="ml-1 font-medium text-foreground">{analysis.readabilityScore}%</span>
        </p>
      </div>
    </div>
  )
}
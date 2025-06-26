"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, AlertCircle, Clock, Download, Film } from "lucide-react";
import { toast } from "react-hot-toast";

interface SyncResult {
  upcoming?: {
    success: boolean;
    added?: number;
    skipped?: number;
    errors?: number;
    message: string;
  };
  yts?: {
    success: boolean;
    added?: number;
    updated?: number;
    skipped?: number;
    errors?: number;
    message: string;
  };
  popular?: {
    success: boolean;
    message: string;
  };
  timestamp: string;
}

export function MovieSyncStatus() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<SyncResult | null>(null);

  const triggerSync = async (type: 'all' | 'yts' | 'tmdb') => {
    setIsLoading(type);
    try {
      const response = await fetch('/api/sync-movies', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token', // You should implement proper auth
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sync API error:', response.status, errorText);
        
        // Try to parse as JSON for better error handling
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(`Sync failed: ${errorJson.error || errorJson.details || 'Unknown error'}`);
        } catch {
          // If not JSON, show the raw error
          toast.error(`Sync failed: ${response.status} - ${errorText.substring(0, 100)}`);
        }
        return;
      }

      const result = await response.json();

      if (result.success) {
        setLastSync(result.data);
        toast.success(`Movie sync (${type}) completed successfully!`);
      } else {
        toast.error(`Sync failed: ${result.error || result.details || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error triggering sync:', error);
      toast.error('Failed to trigger movie sync - check console for details');
    } finally {
      setIsLoading(null);
    }
  };

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "Success" : "Failed"}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Movie Database Sync
        </CardTitle>
        <CardDescription>
          Automatically sync movies from TMDB and YTS to your database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Last Sync</p>
            <p className="text-xs text-muted-foreground">
              {lastSync ? new Date(lastSync.timestamp).toLocaleString() : 'Never'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => triggerSync('yts')} 
              disabled={isLoading !== null}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoading === 'yts' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isLoading === 'yts' ? 'Syncing YTS...' : 'Sync YTS'}
            </Button>
            <Button 
              onClick={() => triggerSync('tmdb')} 
              disabled={isLoading !== null}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoading === 'tmdb' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Film className="h-4 w-4" />
              )}
              {isLoading === 'tmdb' ? 'Syncing TMDB...' : 'Sync TMDB'}
            </Button>
            <Button 
              onClick={() => triggerSync('all')} 
              disabled={isLoading !== null}
              className="flex items-center gap-2"
            >
              {isLoading === 'all' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isLoading === 'all' ? 'Syncing All...' : 'Sync All'}
            </Button>
          </div>
        </div>

        {lastSync && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lastSync.yts && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center gap-2">
                    {getStatusIcon(lastSync.yts.success)}
                    YTS Movies
                  </h4>
                  {getStatusBadge(lastSync.yts.success)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {lastSync.yts.message}
                </p>
                {lastSync.yts.added !== undefined && (
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">
                      Added: {lastSync.yts.added}
                    </span>
                    <span className="text-blue-600">
                      Updated: {lastSync.yts.updated || 0}
                    </span>
                    <span className="text-yellow-600">
                      Skipped: {lastSync.yts.skipped}
                    </span>
                    <span className="text-red-600">
                      Errors: {lastSync.yts.errors}
                    </span>
                  </div>
                )}
              </div>
            )}

            {lastSync.upcoming && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center gap-2">
                    {getStatusIcon(lastSync.upcoming.success)}
                    TMDB Upcoming
                  </h4>
                  {getStatusBadge(lastSync.upcoming.success)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {lastSync.upcoming.message}
                </p>
                {lastSync.upcoming.added !== undefined && (
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">
                      Added: {lastSync.upcoming.added}
                    </span>
                    <span className="text-yellow-600">
                      Skipped: {lastSync.upcoming.skipped}
                    </span>
                    <span className="text-red-600">
                      Errors: {lastSync.upcoming.errors}
                    </span>
                  </div>
                )}
              </div>
            )}

            {lastSync.popular && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center gap-2">
                    {getStatusIcon(lastSync.popular.success)}
                    Popular Movies
                  </h4>
                  {getStatusBadge(lastSync.popular.success)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {lastSync.popular.message}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>YTS Sync:</strong> Fetches latest downloadable movies from YTS and adds/updates them in your database</p>
          <p><strong>TMDB Sync:</strong> Fetches upcoming movies from TMDB and adds them to your database</p>
          <p><strong>Full Sync:</strong> Runs both YTS and TMDB syncs together</p>
          <p><strong>Auto Updates:</strong> Existing movies are updated with better quality data from YTS</p>
          <p><strong>Rate Limiting:</strong> Built-in delays to avoid API restrictions</p>
        </div>
      </CardContent>
    </Card>
  );
} 
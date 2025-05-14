
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  geoDbPath: z.string().default("/path/to/GeoLite2-City.mmdb"),
  enableGeolocation: z.boolean().default(true),
  includeInTracking: z.boolean().default(true),
  updateFrequency: z.string().default("monthly"),
});

const GeolocationSetup = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      geoDbPath: "/path/to/GeoLite2-City.mmdb",
      enableGeolocation: true,
      includeInTracking: true,
      updateFrequency: "monthly",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Geolocation settings saved successfully");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geolocation Setup</CardTitle>
        <CardDescription>Configure GeoLite2 database for IP geolocation tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-800">Important Notice</h4>
            <p className="text-xs text-amber-700 mt-1">
              You need to download the GeoLite2-City.mmdb database from MaxMind and provide the path here. 
              For optimal performance on Render.com hosting, place the database in the project root or a accessible directory.
            </p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="geoDbPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GeoLite2 Database Path</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Path to your GeoLite2-City.mmdb file on the server
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="enableGeolocation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Geolocation</FormLabel>
                    <FormDescription>
                      Use IP geolocation in tracking events
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="includeInTracking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Include in Pixel Events</FormLabel>
                    <FormDescription>
                      Add location data to Facebook Pixel events
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="updateFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Update Frequency</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    How often to update the GeoLite2 database
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="px-0 pb-0">
              <Button type="submit">Save Geolocation Settings</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GeolocationSetup;

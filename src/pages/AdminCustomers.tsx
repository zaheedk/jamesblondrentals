import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCustomers, useBulkImportCustomers } from '@/hooks/use-customers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Upload, Search, Users } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import type { CustomerInsert } from '@/hooks/use-customers';

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const { data: customers, isLoading, error } = useCustomers();
  const bulkImport = useBulkImportCustomers();

  const parseDateString = (dateStr: string): string | null => {
    if (!dateStr || dateStr === '01/Jan/1900') return null;
    
    try {
      // Parse format like "17/Aug/1979"
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parts[0];
        const monthStr = parts[1];
        const year = parts[2];
        
        const monthMap: { [key: string]: string } = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
          'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
          'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        
        const month = monthMap[monthStr];
        if (month) {
          return `${year}-${month}-${day.padStart(2, '0')}`;
        }
      }
    } catch (e) {
      console.error('Error parsing date:', dateStr, e);
    }
    
    return null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const customersToImport: CustomerInsert[] = results.data.map((row: any) => {
            // Clean license and passport numbers (remove masked values like "1****u")
            const licenseNumber = row['License#'] && !row['License#'].includes('*') ? row['License#'] : null;
            const passportNumber = row['Passport#'] && !row['Passport#'].includes('*') ? row['Passport#'] : null;
            
            return {
              customer_id: row['Customer ID'] || null,
              last_name: row['Last Name'] || '',
              first_name: row['First Name'] || '',
              dob: parseDateString(row['DOB']),
              mobile: row['Mobile'] || null,
              phone: row['Phone'] || null,
              email: row['Email'] || '',
              address: row['Address'] || null,
              city: row['City'] || null,
              state_province: row['States Provinces'] || null,
              postcode: row['Postcode'] || null,
              license_number: licenseNumber,
              passport_number: passportNumber,
              country: row['Country'] || null,
            };
          });

          try {
            await bulkImport.mutateAsync(customersToImport);
            toast.success(`Successfully imported ${customersToImport.length} customers`);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } catch (error: any) {
            console.error('Import error:', error);
            toast.error(`Failed to import customers: ${error.message}`);
          } finally {
            setIsUploading(false);
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast.error('Failed to parse CSV file');
          setIsUploading(false);
        },
      });
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
      setIsUploading(false);
    }
  };

  const filteredCustomers = customers?.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.customer_id?.toLowerCase().includes(query) ||
      customer.first_name?.toLowerCase().includes(query) ||
      customer.last_name?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query) ||
      customer.mobile?.toLowerCase().includes(query)
    );
  });

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-destructive">Error loading customers: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Customer Management - Admin</title>
      </Helmet>

      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground mt-2">View and manage customer records</p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {customers?.length || 0} total customers
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import Customers</CardTitle>
            <CardDescription>Upload a CSV file to bulk import customer records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="max-w-md"
              />
              <Button disabled={isUploading} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload CSV'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              CSV should include: Customer ID, Last Name, First Name, DOB, Mobile, Phone, Email, Address, City, State/Province, Postcode, License#, Passport#, Country
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Customers</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <CardDescription>
              {filteredCustomers?.length || 0} customer{filteredCustomers?.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>License #</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers && filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <Badge variant="outline">{customer.customer_id}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {customer.first_name} {customer.last_name}
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.mobile || customer.phone || '-'}</TableCell>
                          <TableCell>{customer.city || '-'}</TableCell>
                          <TableCell>{customer.country || '-'}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {customer.license_number || '-'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No customers found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminCustomers;

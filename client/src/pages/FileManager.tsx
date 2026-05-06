import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Upload, Download, Trash2, File } from "lucide-react";
import { toast } from "sonner";

export default function FileManager() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const customersQuery = trpc.customers.list.useQuery();
  const filesQuery = trpc.files.getByCustomer.useQuery(selectedCustomerId || 0, {
    enabled: selectedCustomerId !== null,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedCustomerId) {
      toast.error("Please select a file and customer");
      return;
    }

    setIsUploading(true);
    try {
      const buffer = await uploadFile.arrayBuffer();
      toast.success("File uploaded successfully!");
      setUploadFile(null);
      filesQuery.refetch();
    } catch (error) {
      toast.error("Failed to upload file");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">File Manager</h1>
          <p className="text-muted-foreground">Manage and upload files for customers</p>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Upload New File</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Customer</label>
              <select
                value={selectedCustomerId || ""}
                onChange={(e) => setSelectedCustomerId(parseInt(e.target.value) || null)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">-- Select Customer --</option>
                {customersQuery.data?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select File</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary cursor-pointer transition">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to select or drag file here</p>
                  {uploadFile && (
                    <p className="text-xs text-green-600 mt-2">✓ {uploadFile.name}</p>
                  )}
                </label>
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!uploadFile || !selectedCustomerId || isUploading}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        </Card>

        {selectedCustomerId && (
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Customer Files</h2>
            {filesQuery.isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : filesQuery.data && filesQuery.data.length > 0 ? (
              <div className="space-y-2">
                {filesQuery.data.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.fileSize || 0) / 1024 / 1024 > 0 ? `${((file.fileSize || 0) / 1024 / 1024).toFixed(2)} MB` : `${((file.fileSize || 0) / 1024).toFixed(2)} KB`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.fileUrl, "_blank")}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No files for this customer</p>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

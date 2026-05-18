import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import {
  CarRecord,
  downloadCsv,
  formatCurrency,
  formatDate,
  labelStatus,
  normalizeCar,
} from "@/lib/adminUtils";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { Textarea } from "@/components/textarea";
import { Switch } from "@/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { CheckCircle, Download, ImagePlus, Loader2, Star, Trash2, Upload } from "lucide-react";

const initialCarForm = {
  name: "",
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  vin: "",
  category: "sedan",
  bodyType: "Sedan",
  condition: "Foreign Used",
  price: "",
  transmission: "Automatic",
  fuelType: "Petrol",
  mileage: "0",
  country: "",
  description: "",
  features: "",
  tags: "",
  status: "available",
  visibility: true,
};

export default function VehicleInventoryPage() {
  const [cars, setCars] = useState<CarRecord[]>([]);
  const [form, setForm] = useState(initialCarForm);
  const [files, setFiles] = useState<FileList | null>(null);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImagePreviews, setExistingImagePreviews] = useState<Record<number, string[]>>({});
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCars = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.cars.getAllAdmin({ limit: 100, search });
      setCars((response.data || []).map(normalizeCar));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load cars");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = window.setTimeout(loadCars, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const featuredCars = useMemo(
    () => cars.filter((car) => car.tags.includes("popular")),
    [cars],
  );

  const setField = (field: keyof typeof initialCarForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const carPayload = () => ({
    ...form,
    year: Number(form.year),
    price: Number(form.price),
    mileage: Number(form.mileage || 0),
    vin: form.vin || undefined,
    country: form.country || undefined,
    features: form.features
      .split(",")
      .map((feature) => feature.trim())
      .filter(Boolean),
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  });

  const createCar = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await api.cars.create(carPayload());
      const carId = response.data?.id;
      if (carId && files && files.length > 0) {
        await api.cars.uploadImages(carId, files);
      }
      setForm(initialCarForm);
      setFiles(null);
      setNewImagePreviews([]);
      setMessage("Vehicle uploaded successfully.");
      await loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create vehicle");
    } finally {
      setIsSaving(false);
    }
  };

  const updateNewFiles = (fileList: FileList | null) => {
    setFiles(fileList);
    setNewImagePreviews(fileList ? Array.from(fileList).map((file) => URL.createObjectURL(file)) : []);
  };

  const updateExistingFiles = (carId: number, fileList: FileList | null) => {
    setExistingImagePreviews((current) => ({
      ...current,
      [carId]: fileList ? Array.from(fileList).map((file) => URL.createObjectURL(file)) : [],
    }));
    uploadImages(carId, fileList);
  };

  const uploadImages = async (carId: number, imageFiles: FileList | null) => {
    if (!imageFiles || imageFiles.length === 0) return;
    setActionId(`upload-${carId}`);
    setMessage("");
    try {
      await api.cars.uploadImages(carId, imageFiles);
      setExistingImagePreviews((current) => ({ ...current, [carId]: [] }));
      window.alert("Images uploaded successfully.");
      setMessage("Images uploaded successfully.");
      await loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload images");
    } finally {
      setActionId(null);
    }
  };

  const deleteImage = async (carId: number, imageId: number) => {
    if (!window.confirm("Delete this image? Deletion is permanent and cannot be undone.")) return;

    setActionId(`image-${imageId}`);
    try {
      await api.cars.deleteImage(carId, imageId);
      await loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete image");
    } finally {
      setActionId(null);
    }
  };

  const updateCar = async (car: CarRecord, data: Partial<CarRecord>) => {
    setActionId(`car-${car.id}`);
    try {
      await api.cars.update(car.id, data);
      await loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update vehicle");
    } finally {
      setActionId(null);
    }
  };

  const toggleFeatured = (car: CarRecord) => {
    const nextTags = car.tags.includes("popular")
      ? car.tags.filter((tag) => tag !== "popular")
      : [...car.tags, "popular"];
    updateCar(car, { tags: nextTags } as Partial<CarRecord>);
  };

  const deleteCar = async (carId: number) => {
    if (!window.confirm("Delete this vehicle and all attached images?")) return;
    setActionId(`delete-${carId}`);
    try {
      await api.cars.delete(carId);
      await loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete vehicle");
    } finally {
      setActionId(null);
    }
  };

  const exportVehicles = () => {
    downloadCsv(
      "vehicle-inventory.csv",
      cars.map((car) => ({
        id: car.id,
        name: car.name,
        brand: car.brand,
        model: car.model,
        year: car.year,
        vin: car.vin,
        category: car.category,
        bodyType: car.bodyType,
        condition: car.condition,
        price: car.price,
        mileage: car.mileage,
        status: car.status,
        visibility: car.visibility,
        featured: car.tags.includes("popular"),
        images: car.images.length,
        createdAt: car.createdAt,
      })),
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
          <p className="text-gray-600">Upload, organize, feature, and publish cars across the site.</p>
        </div>
        <Button onClick={exportVehicles} className="bg-red-600 hover:bg-red-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Vehicles
        </Button>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      <Card className="p-6 border-none shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Upload New Vehicle</h2>
        <form onSubmit={createCar} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input required value={form.name} onChange={(e) => setField("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Brand</Label>
            <Input required value={form.brand} onChange={(e) => setField("brand", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Input required value={form.model} onChange={(e) => setField("model", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input required type="number" value={form.year} onChange={(e) => setField("year", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <Input required type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Mileage</Label>
            <Input type="number" value={form.mileage} onChange={(e) => setField("mileage", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(value) => setField("category", value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["luxury", "sedan", "suv", "sports", "coupe", "hatchback", "truck", "van"].map((value) => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Body Type</Label>
            <Select value={form.bodyType} onValueChange={(value) => setField("bodyType", value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Sedan", "SUV", "Coupe", "Hatchback", "Truck", "Van", "Wagon", "Convertible"].map((value) => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select value={form.condition} onValueChange={(value) => setField("condition", value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["New", "Foreign Used", "Nigerian Used"].map((value) => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Transmission</Label>
            <Select value={form.transmission} onValueChange={(value) => setField("transmission", value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fuel Type</Label>
            <Select value={form.fuelType} onValueChange={(value) => setField("fuelType", value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Petrol", "Diesel", "Hybrid", "Electric"].map((value) => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(value) => setField("status", value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["available", "reserved", "sold", "hidden"].map((value) => (
                  <SelectItem key={value} value={value}>{labelStatus(value)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>VIN</Label>
            <Input value={form.vin} onChange={(e) => setField("vin", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Input value={form.country} onChange={(e) => setField("country", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Images</Label>
            <Input type="file" multiple accept="image/*" onChange={(e) => updateNewFiles(e.target.files)} />
          </div>
          {newImagePreviews.length > 0 && (
            <div className="md:col-span-3 flex flex-wrap gap-3">
              {newImagePreviews.map((preview, index) => (
                <img key={preview} src={preview} alt={`New vehicle preview ${index + 1}`} className="h-20 w-28 rounded object-cover border" />
              ))}
            </div>
          )}
          <div className="space-y-2 md:col-span-3">
            <Label>Features</Label>
            <Input placeholder="Comma-separated features" value={form.features} onChange={(e) => setField("features", e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Tags</Label>
            <Input placeholder="popular, hotDeal, promo, searched" value={form.tags} onChange={(e) => setField("tags", e.target.value)} />
          </div>
          <div className="flex items-center gap-3 pt-8">
            <Switch checked={form.visibility} onCheckedChange={(checked) => setField("visibility", checked)} />
            <Label>Visible on public site</Label>
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setField("description", e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Upload Vehicle
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6 border-none shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Featured Cars</h2>
            <p className="text-sm text-gray-600">Cars marked featured appear in the homepage Featured Collection.</p>
          </div>
          <Badge className="bg-red-600 text-white">{featuredCars.length} featured</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {featuredCars.length === 0 ? (
            <p className="text-sm text-gray-500">No cars are currently featured.</p>
          ) : (
            featuredCars.map((car) => <Badge key={car.id} variant="outline">{car.brand} {car.model}</Badge>)
          )}
        </div>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">All Vehicles</h2>
          <Input className="md:max-w-sm" placeholder="Search vehicles..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={7} className="py-10 text-center text-gray-500">Loading vehicles...</TableCell></TableRow>
              )}
              {!isLoading && cars.length === 0 && (
                <TableRow><TableCell colSpan={7} className="py-10 text-center text-gray-500">No vehicles found.</TableCell></TableRow>
              )}
              {cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <img src={car.image} alt={car.name} className="h-16 w-20 rounded object-cover bg-gray-100" />
                      <div>
                        <div className="font-medium">{car.name}</div>
                        <div className="text-sm text-gray-600">{car.brand} {car.model}</div>
                        <div className="text-sm text-gray-600">{formatCurrency(car.price)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div>{car.year} • {car.condition} • {car.bodyType}</div>
                    <div>{car.transmission} • {car.fuelType} • {car.mileage.toLocaleString()} km</div>
                    <div>{labelStatus(car.status)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2 max-w-[220px]">
                        {car.images.map((image) => (
                        <div key={image.id} className="relative">
                          <img src={image.url} alt={car.name} className="h-12 w-16 rounded object-cover" />
                          <button
                            type="button"
                            onClick={() => deleteImage(car.id, image.id)}
                            className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white"
                            disabled={actionId === `image-${image.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <label className="h-12 w-16 cursor-pointer rounded border border-dashed border-gray-300 flex items-center justify-center">
                        <ImagePlus className="h-4 w-4 text-gray-500" />
                        <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => updateExistingFiles(car.id, e.target.files)} />
                      </label>
                      {existingImagePreviews[car.id]?.map((preview, index) => (
                        <img key={preview} src={preview} alt={`Pending upload ${index + 1}`} className="h-12 w-16 rounded object-cover border border-green-300" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={!!car.visibility}
                      onCheckedChange={(checked) => updateCar(car, { visibility: checked } as Partial<CarRecord>)}
                      disabled={actionId === `car-${car.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleFeatured(car)}>
                      {car.tags.includes("popular") ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Star className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{formatDate(car.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteCar(car.id)} disabled={actionId === `delete-${car.id}`}>
                      {actionId === `delete-${car.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-600" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

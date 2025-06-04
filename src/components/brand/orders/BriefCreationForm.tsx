import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, X, FileText, Calendar, Target, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BriefCreationFormProps {
  onSave: (briefData: BriefFormData) => void;
  onCancel: () => void;
  orderId: string;
  initialData?: Partial<BriefFormData>;
}

export interface BriefFormData {
  campaignObjective: string;
  targetAudience: string;
  keyMessages: string[];
  contentGuidelines: string;
  brandGuidelines: string;
  dosList: string[];
  dontsList: string[];
  deliverables: {
    platform: string;
    contentType: string;
    quantity: number;
    specifications: string;
  }[];
  timeline: {
    contentDue: string;
    reviewPeriod: string;
    publishDate: string;
  };
  additionalNotes: string;
  hashtags: string[];
  mentions: string[];
  approvalProcess: string;
}

const BriefCreationForm: React.FC<BriefCreationFormProps> = ({
  onSave,
  onCancel,
  orderId,
  initialData
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BriefFormData>({
    campaignObjective: initialData?.campaignObjective || '',
    targetAudience: initialData?.targetAudience || '',
    keyMessages: initialData?.keyMessages || [''],
    contentGuidelines: initialData?.contentGuidelines || '',
    brandGuidelines: initialData?.brandGuidelines || '',
    dosList: initialData?.dosList || [''],
    dontsList: initialData?.dontsList || [''],
    deliverables: initialData?.deliverables || [{
      platform: '',
      contentType: '',
      quantity: 1,
      specifications: ''
    }],
    timeline: initialData?.timeline || {
      contentDue: '',
      reviewPeriod: '',
      publishDate: ''
    },
    additionalNotes: initialData?.additionalNotes || '',
    hashtags: initialData?.hashtags || [],
    mentions: initialData?.mentions || [],
    approvalProcess: initialData?.approvalProcess || 'standard'
  });

  const [newHashtag, setNewHashtag] = useState('');
  const [newMention, setNewMention] = useState('');

  const updateFormData = (field: keyof BriefFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: 'keyMessages' | 'dosList' | 'dontsList') => {
    updateFormData(field, [...formData[field], '']);
  };

  const removeArrayItem = (field: 'keyMessages' | 'dosList' | 'dontsList', index: number) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    updateFormData(field, newArray);
  };

  const updateArrayItem = (field: 'keyMessages' | 'dosList' | 'dontsList', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    updateFormData(field, newArray);
  };

  const addDeliverable = () => {
    updateFormData('deliverables', [...formData.deliverables, {
      platform: '',
      contentType: '',
      quantity: 1,
      specifications: ''
    }]);
  };

  const removeDeliverable = (index: number) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables.splice(index, 1);
    updateFormData('deliverables', newDeliverables);
  };

  const updateDeliverable = (index: number, field: string, value: any) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], [field]: value };
    updateFormData('deliverables', newDeliverables);
  };

  const addHashtag = () => {
    if (newHashtag.trim() && !formData.hashtags.includes(newHashtag.trim())) {
      updateFormData('hashtags', [...formData.hashtags, newHashtag.trim()]);
      setNewHashtag('');
    }
  };

  const removeHashtag = (hashtag: string) => {
    updateFormData('hashtags', formData.hashtags.filter(h => h !== hashtag));
  };

  const addMention = () => {
    if (newMention.trim() && !formData.mentions.includes(newMention.trim())) {
      updateFormData('mentions', [...formData.mentions, newMention.trim()]);
      setNewMention('');
    }
  };

  const removeMention = (mention: string) => {
    updateFormData('mentions', formData.mentions.filter(m => m !== mention));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.campaignObjective || !formData.targetAudience) {
      toast({
        title: "Missing Information",
        description: "Please fill in the campaign objective and target audience.",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty items
    const cleanedData = {
      ...formData,
      keyMessages: formData.keyMessages.filter(msg => msg.trim()),
      dosList: formData.dosList.filter(item => item.trim()),
      dontsList: formData.dontsList.filter(item => item.trim()),
      deliverables: formData.deliverables.filter(d => d.platform && d.contentType)
    };

    onSave(cleanedData);
    toast({
      title: "Brief Saved",
      description: "Campaign brief has been created successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Campaign Brief Creation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Objective */}
          <div className="space-y-2">
            <Label htmlFor="objective" className="text-sm font-medium">Campaign Objective *</Label>
            <Textarea
              id="objective"
              placeholder="Describe the main goal and purpose of this campaign..."
              value={formData.campaignObjective}
              onChange={(e) => updateFormData('campaignObjective', e.target.value)}
              rows={3}
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="audience" className="text-sm font-medium">Target Audience *</Label>
            <Textarea
              id="audience"
              placeholder="Describe your target demographic, interests, behaviors..."
              value={formData.targetAudience}
              onChange={(e) => updateFormData('targetAudience', e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          {/* Key Messages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Key Messages</Label>
              <Button size="sm" variant="outline" onClick={() => addArrayItem('keyMessages')}>
                <Plus className="h-3 w-3 mr-1" />
                Add Message
              </Button>
            </div>
            <div className="space-y-2">
              {formData.keyMessages.map((message, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Key message ${index + 1}`}
                    value={message}
                    onChange={(e) => updateArrayItem('keyMessages', index, e.target.value)}
                  />
                  {formData.keyMessages.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeArrayItem('keyMessages', index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Content Guidelines */}
          <div className="space-y-2">
            <Label htmlFor="content-guidelines" className="text-sm font-medium">Content Guidelines</Label>
            <Textarea
              id="content-guidelines"
              placeholder="Specify tone, style, format requirements..."
              value={formData.contentGuidelines}
              onChange={(e) => updateFormData('contentGuidelines', e.target.value)}
              rows={3}
            />
          </div>

          {/* Brand Guidelines */}
          <div className="space-y-2">
            <Label htmlFor="brand-guidelines" className="text-sm font-medium">Brand Guidelines</Label>
            <Textarea
              id="brand-guidelines"
              placeholder="Brand colors, fonts, logo usage, voice..."
              value={formData.brandGuidelines}
              onChange={(e) => updateFormData('brandGuidelines', e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          {/* Do's and Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Do's */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-green-700">Do's</Label>
                <Button size="sm" variant="outline" onClick={() => addArrayItem('dosList')}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Do
                </Button>
              </div>
              <div className="space-y-2">
                {formData.dosList.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Do #${index + 1}`}
                      value={item}
                      onChange={(e) => updateArrayItem('dosList', index, e.target.value)}
                    />
                    {formData.dosList.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem('dosList', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Don'ts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-red-700">Don'ts</Label>
                <Button size="sm" variant="outline" onClick={() => addArrayItem('dontsList')}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Don't
                </Button>
              </div>
              <div className="space-y-2">
                {formData.dontsList.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Don't #${index + 1}`}
                      value={item}
                      onChange={(e) => updateArrayItem('dontsList', index, e.target.value)}
                    />
                    {formData.dontsList.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeArrayItem('dontsList', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Deliverables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Deliverables</Label>
              <Button size="sm" variant="outline" onClick={addDeliverable}>
                <Plus className="h-3 w-3 mr-1" />
                Add Deliverable
              </Button>
            </div>
            <div className="space-y-4">
              {formData.deliverables.map((deliverable, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Select
                      value={deliverable.platform}
                      onValueChange={(value) => updateDeliverable(index, 'platform', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={deliverable.contentType}
                      onValueChange={(value) => updateDeliverable(index, 'contentType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Content Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="post">Post</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="reel">Reel</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={deliverable.quantity}
                      onChange={(e) => updateDeliverable(index, 'quantity', parseInt(e.target.value) || 1)}
                    />

                    <div className="flex gap-2">
                      <Input
                        placeholder="Specifications"
                        value={deliverable.specifications}
                        onChange={(e) => updateDeliverable(index, 'specifications', e.target.value)}
                      />
                      {formData.deliverables.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeDeliverable(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timeline
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content-due" className="text-xs">Content Due Date</Label>
                <Input
                  id="content-due"
                  type="date"
                  value={formData.timeline.contentDue}
                  onChange={(e) => updateFormData('timeline', { ...formData.timeline, contentDue: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-period" className="text-xs">Review Period (days)</Label>
                <Input
                  id="review-period"
                  placeholder="2"
                  value={formData.timeline.reviewPeriod}
                  onChange={(e) => updateFormData('timeline', { ...formData.timeline, reviewPeriod: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publish-date" className="text-xs">Publish Date</Label>
                <Input
                  id="publish-date"
                  type="date"
                  value={formData.timeline.publishDate}
                  onChange={(e) => updateFormData('timeline', { ...formData.timeline, publishDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Hashtags and Mentions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hashtags */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Required Hashtags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="#hashtag"
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                />
                <Button size="sm" onClick={addHashtag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.hashtags.map((hashtag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    #{hashtag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeHashtag(hashtag)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mentions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Required Mentions</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="@mention"
                  value={newMention}
                  onChange={(e) => setNewMention(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMention()}
                />
                <Button size="sm" onClick={addMention}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.mentions.map((mention, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    @{mention}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeMention(mention)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additional-notes" className="text-sm font-medium">Additional Notes</Label>
            <Textarea
              id="additional-notes"
              placeholder="Any other important information or requirements..."
              value={formData.additionalNotes}
              onChange={(e) => updateFormData('additionalNotes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Approval Process */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Approval Process</Label>
            <Select
              value={formData.approvalProcess}
              onValueChange={(value) => updateFormData('approvalProcess', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Review (2-3 days)</SelectItem>
                <SelectItem value="fast">Fast Track (24 hours)</SelectItem>
                <SelectItem value="detailed">Detailed Review (5-7 days)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Brief
        </Button>
      </div>
    </div>
  );
};

export default BriefCreationForm;